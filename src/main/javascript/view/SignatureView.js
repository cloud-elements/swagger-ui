'use strict';

SwaggerUi.Views.SignatureView = Backbone.View.extend({
  events: {
    'click a.description-link'       : 'switchToDescription',
    'click a.snippet-link'           : 'switchToSnippet',
    'mousedown .snippet'          : 'snippetToTextArea'
  },

  initialize: function () {
      this.model.options = SwaggerUi.options;
  },

  render: function(){

    $(this.el).html(Handlebars.templates.signature(this.model));
    $('.description', $(this.el)).context.firstload = true;
      //Commenting out to always default to description
//    if (this.model.defaultRendering === 'model') {
      this.switchToDescription();
//    } else {
//      this.switchToSnippet();
//    }

    this.isParam = this.model.isParam;

    if (this.isParam) {
      $('.notice', $(this.el)).text('Click to set as parameter value');
    }

    return this;
  },

  // handler for show signature
  switchToDescription: function(e){
    if (e) { e.preventDefault(); }

      //Bydefault the model is not visible to and when the user clicks on the model it opens up the model
      var snippetVisible = $('.snippet', $(this.el)).is(':visible');
      var descriptionVisible = $('.description', $(this.el)).is(':visible');

      if(snippetVisible === true) {
          $('.snippet', $(this.el)).hide();
          $('.description', $(this.el)).show();
          $('.description-downarrow', $(this.el)).show();
          $('.description-rightarrow', $(this.el)).hide();

          $('.description-link', $(this.el)).addClass('selected');
      } else {
          $('.snippet', $(this.el)).hide();
          $('.description-link', $(this.el)).addClass('selected');

          if($('.description', $(this.el)).context.firstload === true) {
              $('.description', $(this.el)).hide();
              $('.description', $(this.el)).context.firstload = false;
              $('.description-downarrow', $(this.el)).hide();
              $('.description-rightarrow', $(this.el)).show();
          } else {
              $('.description', $(this.el)).toggle();

              if(descriptionVisible === true) {
                  $('.description-downarrow', $(this.el)).hide();
                  $('.description-rightarrow', $(this.el)).show();
              } else {
                  $('.description-downarrow', $(this.el)).show();
                  $('.description-rightarrow', $(this.el)).hide();
              }
          }
      }

     $('.snippet-link', $(this.el)).removeClass('selected');
  },

  // handler for show sample
  switchToSnippet: function(e){
    if (e) { e.preventDefault(); }

    $('.description', $(this.el)).hide();
    $('.snippet', $(this.el)).show();
    $('.snippet-link', $(this.el)).addClass('selected');
    $('.description-link', $(this.el)).removeClass('selected');
  },

  // handler for snippet to text area
  snippetToTextArea: function(e) {
    if (this.isParam) {
      if (e) { e.preventDefault(); }

      var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));

      // Fix for bug in IE 10/11 which causes placeholder text to be copied to "value"
      if ($.trim(textArea.val()) === '' || textArea.prop('placeholder') === textArea.val()) {
        textArea.val(this.model.sampleJSON);
        // TODO move this code outside of the view and expose an event instead
        if( this.model.jsonEditor && this.model.jsonEditor.isEnabled()){
          this.model.jsonEditor.setValue(JSON.parse(this.model.sampleJSON));
        }
      }
    }
  }
});