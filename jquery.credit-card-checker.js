(function($) {
  'use strict';
  var defaults, knownCards, methods;

  defaults = {
    cardIcons : '.accepted_credit_cards',
    radioName : 'card_type'
  };

  knownCards = {
    'visa': {
      prefixes: [4],
      name: 'Visa'
    },
    'mastercard': {
      prefixes: [51, 52, 53, 54, 55],
      name: 'MasterCard'
    },
    'amex': {
      prefixes: [34, 37],
      name: 'American Express'
    },
    'discover': {
      prefixes: [6011, 62, 64, 65],
      name: 'Discover'
    }
  };

  methods = {

    init: function(options) {

      var settings = $.extend({}, defaults, options);

      return this.each(function() {
        methods._setCardType($(this), settings);
      });

    },

    destroy: function() {

      return this.each(function() {
        $(this).unbind();
      });

    },

    _detectCardType : function(cardNumber) {
      var cards = knownCards, ci, c, pi, p, pl;
      cardNumber = cardNumber.replace(/\D/g, '');

      for (ci in cards) {
        c = cards[ci];
        if (cards.hasOwnProperty(ci)) {
          for (pi = 0, pl = c.prefixes.length; pi < pl; pi += 1) {
            p = c.prefixes[pi];
            if (c.prefixes.hasOwnProperty(pi)) {
              if (new RegExp('^' + p.toString()).test(cardNumber)) {
                return ci;
              }
            }
          }
        }
      }
      return false;
    },

    _setCardType : function(formField, settings) {

      var selector, $cardTypeRadios, $acceptedCards;

      selector = ["input[type='radio'][name='", settings.radioName, "']"].join("");
      $cardTypeRadios = $(selector);
      $acceptedCards = $(settings.cardIcons);

      $(formField).bind('change keyup input', function() {
        var type = methods._detectCardType($(this).val());
        if (type) {
          $acceptedCards.find('.card').each(function() {
            $(this).toggleClass('match', $(this).hasClass(type));
            $(this).toggleClass('no_match', !$(this).hasClass(type));
          });
          $cardTypeRadios.filter("[value='" + type + "']").prop('checked', true);
        } else {
          $acceptedCards.find('.card').removeClass('match no_match');
          $cardTypeRadios.prop('checked', false);
        }
      });
    }
  };

  $.fn.creditCardChecker = function methodRouter(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.creditCardChecker');
    }
  };

})(jQuery);
