// Generated by CoffeeScript 1.8.0
var LogoEditor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

LogoEditor = (function() {
  LogoEditor.prototype.font_weight = 180;

  LogoEditor.prototype.font_family = "Open Sans";

  LogoEditor.prototype.icon_factor = 2.7;

  LogoEditor.prototype.icon_label_scale = 2;

  function LogoEditor() {
    this.update = __bind(this.update, this);
    this.init = __bind(this.init, this);
    this.canvas = $("#logocanvas")[0];
    this.final_canvas = $("#finalcanvas")[0];
    this.export_canvas = $("#exportcanvas")[0];
    this.tmp_text = $("#tmp_text");
    this.icon_svg = $("#icon-svg");
    this.icon_img = null;
    this.textinput1 = $('#logoinput1');
    this.textinput2 = $('#logoinput2');
    this.colorinput_logo = $('#colorinput_logo');
    this.colorinput1 = $('#colorinput1');
    this.colorinput2 = $('#colorinput2');
    if ($("#logo_color_logo").val()) {
      this.colorinput_logo.val($("#logo_color_logo").val());
    }
    if ($("#logo_color1").val()) {
      this.colorinput1.val($("#logo_color1").val());
    }
    if ($("#logo_color2").val()) {
      this.colorinput2.val($("#logo_color2").val());
    }
    if ($("#logo_text1").val()) {
      this.textinput1.val($("#logo_text1").val());
    }
    if ($("#logo_text2").val()) {
      this.textinput2.val($("#logo_text2").val());
    }
    this.text1 = this.textinput1.val();
    this.text2 = this.textinput2.val();
    this.color_logo = this.colorinput_logo.val();
    this.color1 = this.colorinput1.val();
    this.color2 = this.colorinput2.val();
  }

  LogoEditor.prototype.init = function() {
    this.init_ui();
    this.init_icon();
    return this.update();
  };

  LogoEditor.prototype.init_icon = function(callback) {};

  LogoEditor.prototype.init_ui = function() {
    $(".colorpicker-container-logo").colorpicker().on('changeColor', (function(_this) {
      return function(ev) {
        _this.color_logo = _this.colorinput_logo.val();
        _this.color1 = _this.colorinput1.val();
        _this.color2 = _this.colorinput2.val();
        return _this.update();
      };
    })(this));
    $('.logoinput').on('keyup', (function(_this) {
      return function(e) {
        _this.text1 = _this.textinput1.val();
        _this.text2 = _this.textinput2.val();
        return _this.update();
      };
    })(this));
    $('#save-as-logo-button').click((function(_this) {
      return function(e) {
        var save_logo;
        e.preventDefault();
        $("#logo_color_logo").val(_this.colorinput_logo.val());
        $("#logo_color1").val(_this.colorinput1.val());
        $("#logo_color2").val(_this.colorinput2.val());
        $("#logo_text1").val(_this.textinput1.val());
        $("#logo_text2").val(_this.textinput2.val());
        save_logo = function(canvas) {
          var base64, data, parts;
          data = canvas.toDataURL("image/png");
          parts = data.split(",");
          base64 = parts[parts.length - 1];
          $("#save-as-logo-button").hide();
          $("#saving-as-logo-button").show();
          return $.ajax({
            url: $("#logoeditor-modal").data("upload-url"),
            type: "POST",
            data: {
              data: base64,
              filename: "" + _this.text1 + _this.text2 + "logo.png"
            },
            success: function(data) {
              var widget;
              widget = $("#uploadwidget-logo");
              $("#logo").val(data.asset_id);
              widget.find(".uploader-buttons").show();
              widget.find(".preview-area img").attr("src", data.url);
              widget.find(".progress").hide();
              widget.find(".preview-area").show();
              $("#logoeditor-modal").modal("hide");
              $("#save-as-logo-button").show();
              return $("#saving-as-logo-button").hide();
            },
            error: function() {
              $("#save-as-logo-button").show();
              return $("#saving-as-logo-button").hide();
            }
          });
        };
        return _this.draw_logo(_this.final_canvas, 1.5, save_logo);
      };
    })(this));
    return $('#save-as-png-button').click((function(_this) {
      return function(e) {
        var callback;
        e.preventDefault();
        callback = function(canvas) {
          var a;
          a = document.createElement("a");
          a.download = "" + _this.text1 + _this.text2 + "logo.png";
          a.href = canvas.toDataURL("image/png");
          a.click();
        };
        _this.draw_logo(_this.export_canvas, 3.8, callback);
        return $("#logoeditor-modal").modal("hide");
      };
    })(this));
  };

  LogoEditor.prototype.update = function() {
    return this.draw_logo(this.canvas, 1.1);
  };

  LogoEditor.prototype.draw_logo = function(canvas, screen_factor, callback) {
    var ctx, icon_width, offsets, scale, text_width1;
    if (screen_factor == null) {
      screen_factor = 1;
    }
    if (callback == null) {
      callback = null;
    }
    ctx = canvas.getContext("2d");
    offsets = this.compute_scale(canvas, screen_factor);
    scale = offsets.scale;
    text_width1 = offsets.text_width1;
    icon_width = offsets.icon_width;
    console.log("drawing with scale " + offsets.scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.draw_text(canvas, scale, icon_width, icon_width + text_width1);
    return this.draw_icon(canvas, scale, callback);
  };

  LogoEditor.prototype.compute_scale = function(canvas, screen_factor) {
    var factor, font1, font2, full_width, icon_width, scale, text_width1, text_width2;
    font1 = "bold " + (this.font_weight * 0.7) + "px " + this.font_family;
    font2 = "normal " + (this.font_weight * 0.7) + "px " + this.font_family;
    text_width1 = $("#tmp_text").css('font', font1).text(this.text1).width();
    text_width2 = $("#tmp_text").css('font', font2).text(this.text2).width();
    icon_width = 90 * this.icon_factor;
    full_width = (icon_width + text_width1 + text_width2) * 1.1;
    factor = this.canvas.width / full_width;
    scale = Math.min(1, factor * 0.98);
    return {
      scale: scale * screen_factor,
      icon_width: icon_width * scale * screen_factor,
      text_width1: text_width1 * scale * screen_factor,
      text_width2: text_width2 * scale * screen_factor
    };
  };

  LogoEditor.prototype.draw_text = function(canvas, scale, offset1, offset2) {
    var ctx, font1, font2;
    ctx = canvas.getContext("2d");
    ctx.clearRect(offset1, 0, canvas.width - offset1, canvas.height);
    font1 = "bold " + (this.font_weight * scale * 0.7) + "px " + this.font_family;
    font2 = "normal " + (this.font_weight * scale * 0.7) + "px " + this.font_family;
    ctx.font = font1;
    ctx.fillStyle = this.color1;
    ctx.fillText(this.text1, offset1, canvas.height / 2 + scale * 40);
    ctx.fillStyle = this.color2;
    ctx.font = font2;
    return ctx.fillText(this.text2, offset2, canvas.height / 2 + scale * 40);
  };

  LogoEditor.prototype.draw_icon = function(canvas, scale, callback) {
    var container, ctx, img, svg_scale;
    if (callback == null) {
      callback = null;
    }
    ctx = canvas.getContext("2d");
    svg_scale = this.icon_factor * scale;
    container = this.icon_svg.find('g#container');
    container.attr('transform', "scale(" + svg_scale + ")");
    $(container.children()[0]).css('fill', this.color_logo);
    img = new Image(90 * this.icon_factor * scale, 90 * this.icon_factor * scale);
    img.src = "data:image/svg+xml;base64," + window.btoa($(this.icon_svg).prop('outerHTML'));
    return img.onload = (function(_this) {
      return function() {
        var y;
        y = (canvas.height / 2) - (scale * _this.icon_factor * 45);
        ctx.drawImage(img, 0, y);
        if (callback) {
          return callback(canvas);
        }
      };
    })(this);
  };

  LogoEditor.prototype.resize = function() {
    return this.draw_logo(this.canvas);
  };

  return LogoEditor;

})();

$(function() {
  var le;
  if ($("#logocanvas").length) {
    le = new LogoEditor();
    return le.init();
  }
});
