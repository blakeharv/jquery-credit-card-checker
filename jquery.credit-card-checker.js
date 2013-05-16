(function( $ ) {

  var defaults = {
    cardIcons : '.accepted_credit_cards'
  };

  var knownCards = {
    'visa': {
      prefixes: [4]
    , name: 'Visa'
    }
  , 'mastercard': {
      prefixes: [51, 52, 53, 54, 55]
    , name: 'MasterCard'
    }
  , 'amex': {
      prefixes: [34, 37]
    , name: 'American Express'
    }
  , 'discover': {
      prefixes: [6011, 62, 64, 65]
    , name: 'Discover'
    }
  };

  var methods = {

    init: function( options ) {

      var settings = $.extend({}, defaults, options);

      return this.each(function(){
        methods._setCardType($(this), settings);
     });

    },

    destroy: function() {

      return this.each(function(){
        $(this).unbind();
     });

    },

    _detectCardType : function(cardNumber) {

      cardNumber = cardNumber.replace(/\D/g, '');
      var cards = knownCards;

      for(var ci in cards) {
        if(cards.hasOwnProperty(ci)) {
          var c = cards[ci];
          for(var pi=0,pl=c.prefixes.length; pi < pl; ++pi) {
            if(c.prefixes.hasOwnProperty(pi)) {
              var p = c.prefixes[pi];
              if (new RegExp('^' + p.toString()).test(cardNumber))
                return ci;
            }
          }
        }
      }
      return false;
    },

    _setCardType : function(formField, settings) {

      var $acceptedCards = $(settings.cardIcons);

      $(formField).bind('change keyup input', function() {
        var type = methods._detectCardType( $(this).val() );
        if(type) {
          $acceptedCards.find('.card').each(function(){
            $(this).toggleClass('match', $(this).hasClass(type));
            $(this).toggleClass('no_match', !$(this).hasClass(type));
          });
        }
        else {
          $acceptedCards.find('.card').removeClass('match no_match'); 
        }
      });
    }

  };

  $.fn.creditCardChecker = function methodRouter ( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.creditCardChecker' );
    } 
  };

})( jQuery );

