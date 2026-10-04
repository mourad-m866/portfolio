// إدارة التفاعلات الصغيرة للواجهة دون الحاجة إلى مكتبات خارجية.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  const emptyMessage = document.querySelector(".empty-projects");
  const yearLabel = document.querySelector("#current-year");

  // تحديث سنة التذييل تلقائيًا لتبقى صحيحة دون تعديل يدوي كل عام.
  if (yearLabel) {
    yearLabel.textContent = String(new Date().getFullYear());
  }

  // فتح قائمة الهاتف وإغلاقها بعد اختيار رابط أو الضغط على زر القائمة مجددًا.
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.setAttribute("aria-label", isExpanded ? "فتح القائمة" : "إغلاق القائمة");
      navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "فتح القائمة");
        navigation.classList.remove("is-open");
      });
    });
  }

  // عرض المشاريع المطابقة للتصنيف، مع تحديث حالة الأزرار لقارئات الشاشة.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle("is-active", isSelected);
        filterButton.setAttribute("aria-pressed", String(isSelected));
      });

      projectCards.forEach((card) => {
        const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.hidden = !shouldShow;
        visibleCount += Number(shouldShow);
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount > 0;
      }
    });
  });

  // إظهار العناصر عند وصولها للشاشة، مع دعم المتصفحات الأقدم.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});