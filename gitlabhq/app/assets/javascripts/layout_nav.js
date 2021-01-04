import $ from 'jquery';
import ContextualSidebar from './contextual_sidebar';
import initFlyOutNav from './fly_out_nav';

function hideEndFade($scrollingTabs) {
  $scrollingTabs.each(function scrollTabsLoop() {
    const $this = $(this);
    $this
      .siblings('.fade-right')
      .toggleClass('scrolling', Math.round($this.width()) < $this.prop('scrollWidth'));
  });
}

function initDeferred() {
  $(document).trigger('init.scrolling-tabs');

  const whatsNewTriggerEl = document.querySelector('.js-whats-new-trigger');
  if (whatsNewTriggerEl) {
    const storageKey = whatsNewTriggerEl.getAttribute('data-storage-key');

    $('.header-help').on('show.bs.dropdown', () => {
      const displayNotification = JSON.parse(localStorage.getItem(storageKey));
      if (displayNotification === false) {
        $('.js-whats-new-notification-count').remove();
      }
    });

    whatsNewTriggerEl.addEventListener('click', () => {
      import(/* webpackChunkName: 'whatsNewApp' */ '~/whats_new')
        .then(({ default: initWhatsNew }) => {
          initWhatsNew();
        })
        .catch(() => {});
    });
  }
}

export default function initLayoutNav() {
  const contextualSidebar = new ContextualSidebar();
  contextualSidebar.bindEvents();

  initFlyOutNav();

  // We need to init it on DomContentLoaded as others could also call it
  $(document).on('init.scrolling-tabs', () => {
    const $scrollingTabs = $('.scrolling-tabs').not('.is-initialized');
    $scrollingTabs.addClass('is-initialized');

    $(window)
      .on('resize.nav', () => {
        hideEndFade($scrollingTabs);
      })
      .trigger('resize.nav');

    $scrollingTabs.on('scroll', function tabsScrollEvent() {
      const $this = $(this);
      const currentPosition = $this.scrollLeft();
      const maxPosition = $this.prop('scrollWidth') - $this.outerWidth();

      $this.siblings('.fade-left').toggleClass('scrolling', currentPosition > 0);
      $this.siblings('.fade-right').toggleClass('scrolling', currentPosition < maxPosition - 1);
    });

    $scrollingTabs.each(function scrollTabsEachLoop() {
      const $this = $(this);
      const scrollingTabWidth = $this.width();
      const $active = $this.find('.active');
      const activeWidth = $active.width();

      if ($active.length) {
        const offset = $active.offset().left + activeWidth;

        if (offset > scrollingTabWidth - 30) {
          const scrollLeft = offset - scrollingTabWidth / 2 - activeWidth / 2;

          $this.scrollLeft(scrollLeft);
        }
      }
    });
  });

  requestIdleCallback(initDeferred);
}
