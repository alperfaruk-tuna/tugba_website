// Ana JavaScript dosyası
// Karşılama metni için harf harf yazım animasyonu

(function() {
  const line1El = document.querySelector('.overlay-content .line-1');
  const line2El = document.querySelector('.overlay-content .line-2');
  if (!line1El || !line2El) return;

  const text = 'Hoş Geldiniz';
  const typingDelayMs = 80; // harf arası süre
  const startDelayMs = 400; // başlamadan önce bekleme

  line1El.textContent = '';

  function typeLetters(index) {
    if (index > text.length - 1) {
      // İlk satır bittikten sonra ikinci satırı göster
      requestAnimationFrame(() => line2El.classList.add('show'));
      return;
    }
    line1El.textContent += text[index];
    setTimeout(() => typeLetters(index + 1), typingDelayMs);
  }

  setTimeout(() => typeLetters(0), startDelayMs);
})();

// Accordion toggle fonksiyonu
function toggleAccordion(header) {
  const accordionItem = header.parentElement;
  const content = accordionItem.querySelector('.accordion-content');
  const icon = header.querySelector('.accordion-icon');
  
  // Diğer tüm accordion'ları kapat
  const allAccordions = document.querySelectorAll('.accordion-item');
  allAccordions.forEach(item => {
    if (item !== accordionItem) {
      const otherContent = item.querySelector('.accordion-content');
      const otherHeader = item.querySelector('.accordion-header');
      const otherIcon = item.querySelector('.accordion-icon');
      
      otherContent.classList.remove('active');
      otherHeader.classList.remove('active');
      if (otherIcon) {
        otherIcon.textContent = '+';
      }
    }
  });
  
  // Mevcut accordion'ı aç/kapat
  const isActive = content.classList.contains('active');
  
  if (isActive) {
    content.classList.remove('active');
    header.classList.remove('active');
    icon.textContent = '+';
  } else {
    content.classList.add('active');
    header.classList.add('active');
    icon.textContent = '−';
  }
}

// Yıl bilgisini güncelle (eğer year elementi varsa)
const date = new Date();
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = date.getFullYear();
}

// Mobil menü toggle fonksiyonu - Tüm sayfalarda çalışır
(function() {
  let isInitialized = false;
  
  function initMobileMenu() {
    // Zaten başlatılmışsa tekrar başlatma
    if (isInitialized) return;
    
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;
    
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Toggle butonunu bul
    let menuToggle = headerRight.querySelector('.mobile-menu-toggle');
    
    if (!menuToggle) {
      // Eğer buton yoksa oluştur
      menuToggle = document.createElement('button');
      menuToggle.className = 'mobile-menu-toggle';
      menuToggle.setAttribute('aria-label', 'Menüyü aç/kapat');
      menuToggle.setAttribute('type', 'button');
      menuToggle.innerHTML = '<span></span><span></span><span></span>';
      headerRight.insertBefore(menuToggle, nav);
    }
    
    // Önceki event listener'ı temizlemek için butonu clone et
    const newToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newToggle, menuToggle);
    menuToggle = newToggle;
    
    // Menü toggle işlevi
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = nav.classList.contains('active');
      
      if (isActive) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        nav.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
    
    // Dropdown menüler için mobil uyumluluk
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        // Mevcut event listener'ı temizlemek için clone et
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        // Mobilde dropdown toggle'a tıklandığında
        newToggle.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            // Diğer dropdown'ları kapat
            dropdowns.forEach(dd => {
              if (dd !== dropdown) {
                dd.classList.remove('active');
              }
            });
            // Bu dropdown'ı aç/kapat
            dropdown.classList.toggle('active');
          }
        });
      }
    });
    
    // Menü linklerine tıklandığında menüyü kapat (mobilde)
    const navLinks = nav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
          }, 100);
        }
      });
    });
    
    // Dropdown menü linklerine tıklandığında da menüyü kapat
    const dropdownLinks = nav.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            dropdowns.forEach(dd => dd.classList.remove('active'));
          }, 100);
        }
      });
    });
    
    // Menü dışına tıklandığında menüyü kapat
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && nav && nav.classList.contains('active')) {
        // Tıklanan element menü veya toggle butonu değilse menüyü kapat
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
    
    // Ekran boyutu değiştiğinde menüyü sıfırla
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 768 && nav) {
          nav.classList.remove('active');
          if (menuToggle) menuToggle.classList.remove('active');
          document.body.style.overflow = '';
          dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
      }, 250);
    });
    
    isInitialized = true;
  }
  
  // DOM yüklendiğinde çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    // DOM zaten yüklenmişse hemen çalıştır
    initMobileMenu();
  }
  
  // Sayfa yüklendiğinde de çalıştır (güvenlik için)
  window.addEventListener('load', function() {
    if (!isInitialized) {
      initMobileMenu();
    }
  });
})();

// EmailJS Entegrasyonu
(function() {
  // EmailJS'i başlat
  emailjs.init("8IOl3yYuo90a1KmfZ");
  
  const contactForm = document.getElementById('contactForm');
  const messageDiv = document.getElementById('form-message');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Form validasyonu
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if (!name || name.length < 2) {
        showMessage('Lütfen geçerli bir ad soyad girin (en az 2 karakter).', 'error');
        return;
      }
      
      if (!email || !isValidEmail(email)) {
        showMessage('Lütfen geçerli bir email adresi girin.', 'error');
        return;
      }
      
      if (!message || message.length < 10) {
        showMessage('Lütfen mesajınızı detaylandırın (en az 10 karakter).', 'error');
        return;
      }
      
      // Form verilerini al
      const formData = {
        from_name: name,
        from_email: email,
        message: message,
        phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() || 'Belirtilmedi' : 'Belirtilmedi',
        reply_to: email
      };
      
      // Gönder butonunu devre dışı bırak
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;
      
      // EmailJS ile email gönder
      emailjs.send(
        'service_6ouhjfo',    // Service ID
        'template_cyy4lkm',   // Template ID
        formData
      )
      .then(function(response) {
        // Başarılı
        showMessage('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
        contactForm.reset();
      })
      .catch(function(error) {
        // Hata
        console.error('EmailJS Error:', error);
        showMessage('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin veya doğrudan email gönderin.', 'error');
      })
      .finally(function() {
        // Gönder butonunu tekrar aktif et
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
  
  // Email validasyon fonksiyonu
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function showMessage(text, type) {
    if (messageDiv) {
      messageDiv.textContent = text;
      messageDiv.style.display = 'block';
      
      if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
      } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
      }
      
      // 5 saniye sonra mesajı gizle
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }
})();