document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');
  
  intro.addEventListener('animationend', () => {
    intro.style.display = 'none';
    main.style.display = 'grid';
    
    // 立即触发主内容淡入动画
    main.style.animation = 'none';
    // 强制重排以重置动画
    void main.offsetHeight;
    main.style.animation = 'fadeInMain 1.5s ease forwards';
  });
  
  // 项目轮播功能
  const slides = document.querySelectorAll('#projects .slide');
  const dots = document.querySelectorAll('.nav-dot');
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // 为导航点添加点击事件
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.index));
    });
  });
  
  // 自动轮播
  setInterval(() => {
    let nextSlide = (currentSlide + 1) % slides.length;
    showSlide(nextSlide);
  }, 10000);
  
  // 待办事项切换功能
  document.querySelectorAll('.todo-item input').forEach(checkbox => {
    // 初始化已完成的状态
    if(checkbox.checked) {
      checkbox.nextElementSibling.style.textDecoration = 'line-through';
      checkbox.nextElementSibling.style.opacity = '0.7';
    }
    
    // 添加事件监听
    checkbox.addEventListener('change', function() {
      const label = this.nextElementSibling;
      if(this.checked) {
        label.style.textDecoration = 'line-through';
        label.style.opacity = '0.7';
      } else {
        label.style.textDecoration = 'none';
        label.style.opacity = '1';
      }
    });
  });
});