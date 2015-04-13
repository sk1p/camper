// Generated by CoffeeScript 1.8.0
var Editable, bm;

$.fn.serializeObject = function() {
  var a, o;
  o = {};
  a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== void 0) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      return o[this.name].push(this.value || '');
    } else {
      return o[this.name] = this.value || '';
    }
  });
  return o;
};

Editable = (function() {
  function Editable(elem, options) {
    this.elem = elem;
    this.options = options;
    this.state = "view";
    this.url = $(this.elem).closest("form").attr("action");
    return this;
  }

  Editable.prototype.clicked = function() {
    this.state = this.state === 'view' ? 'edit' : 'view';
    if (this.state === "edit") {
      return this.show_edit_field();
    }
  };

  Editable.prototype.show_edit_field = function() {
    var field;
    field = $(this.elem).data('field');
    return $.ajax({
      url: this.url,
      type: 'GET',
      data: {
        field: field
      },
      success: (function(_this) {
        return function(data) {
          _this.payload = $(_this.elem).html();
          $(_this.elem).html(data.html);
          return _this.escape();
        };
      })(this)
    });
  };

  Editable.prototype.close_edit_field = function() {
    this.state = "view";
    $(this.elem).html(this.payload);
    return this.escape();
  };

  Editable.prototype.escape = function() {
    if (this.state === "view") {
      return $(document).off('keyup.editable.keys');
    } else {
      $(document).on('keyup.editable.keys', (function(_this) {
        return function(e) {
          e.which === 27 && _this.close_edit_field();
          e.which === 13 && console.log("enter");
          return e.preventDefault();
        };
      })(this));
      return $(this.elem).closest("form").submit(function(e) {
        e.preventDefault();
        return false;
      });
    }
  };

  return Editable;

})();

$.fn.editable = function(opts) {
  var init;
  if (opts == null) {
    opts = {};
  }
  init = function(opts) {
    var $this, data, options;
    $this = $(this);
    data = $(this).data('editable');
    options = typeof opts === 'object' && opts;
    if (!data) {
      data = new Editable(this, options);
      $this.data('editable', data);
    }
    return data.clicked();
  };
  $(this).each(init);
  return this;
};

$.fn.limitchars = function(opts) {
  var init;
  if (opts == null) {
    opts = {};
  }
  init = function(opts) {
    var $this, allowed;
    $this = $(this);
    allowed = '1234567890abcdefghijklmnopqrstuvwxyz-_';
    return $(this).keypress(function(e) {
      var k;
      k = parseInt(e.which);
      if (k !== 13 && k !== 8 && k !== 0) {
        if ((e.ctrlKey === false) && (e.altKey === false)) {
          return allowed.indexOf(String.fromCharCode(k)) !== -1;
        } else {
          return true;
        }
      } else {
        return true;
      }
    });
  };
  $(this).each(init);
  return this;
};

$.fn.publish_date = function(opts) {
  var hide_inputs, init, set_now, show_inputs, widget;
  if (opts == null) {
    opts = {};
  }
  widget = null;
  init = function(opts) {
    var date, now;
    widget = this;
    date = $(widget).find(".date").datepicker("getDate");
    date = $(widget).find(".time").timepicker("getTime", [date]);
    console.log(date);
    now = new Date();
    console.log(now);
    if (now <= date) {
      show_inputs();
    } else {
      hide_inputs();
    }
    $(widget).find(".edit-published").click(function() {
      return show_inputs();
    });
    return $(widget).find(".set-now").click(function() {
      set_now();
      return hide_inputs();
    });
  };
  set_now = function() {
    var now;
    now = new Date();
    $(widget).find(".date").datepicker("setDate", [now]);
    return $(widget).find(".time").timepicker("setTime", now);
  };
  show_inputs = function() {
    $(widget).find(".immediate-button").hide();
    $(widget).find(".date-edit").show();
    return $(widget).find(".immediate").val("False");
  };
  hide_inputs = function() {
    $(widget).find(".date-edit").hide();
    $(widget).find(".immediate-button").show();
    return $(widget).find(".immediate").val("True");
  };
  $(this).each(init);
  return this;
};

$.fn.view_edit_group = function(opts) {
  var init, widget;
  if (opts == null) {
    opts = {};
  }
  widget = null;
  init = function(opts) {
    console.log("init");
    widget = this;
    $(widget).find(".input-switch").click(function() {
      console.log("ok");
      $(widget).find(".input-controls").show();
      return $(widget).find(".input-view").hide();
    });
    $(widget).find(".cancel-switch").click(function() {
      $(widget).find(".input-controls").hide();
      return $(widget).find(".input-view").show();
    });
    return $(widget).find(".submit").click(function() {
      var data, url;
      console.log("clicked");
      url = $(widget).data("url");
      data = $(widget).find("form").serializeObject();
      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: (function(_this) {
          return function(data) {
            console.log("success");
            console.log(data);
            $('.workflow-' + data.new_state).attr('selected', 'selected');
            $('.workflow-state').text(data.new_text_state);
            $(widget).find(".input-controls").hide();
            $(widget).find(".input-view").show();
            if (data.new_state === "published") {
              return $("#publish-button").hide();
            } else {
              return $("#publish-button").show();
            }
          };
        })(this)
      });
      return console.log($(widget).find(".input").val());
    });
  };
  $(this).each(init);
  return this;
};

bm = function($) {
  var BigMap, Plugin, old;
  BigMap = function(element, options) {
    var map;
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.map = null;
    this.marker = null;
    L.Icon.Default.imagePath = '/static/img';
    options = {
      accessToken: this.options.accesstoken,
      zoom: 14
    };
    this.map = L.mapbox.map(this.$element.attr('id'), this.options.mapid, options);
    this.lat = null;
    this.lng = null;
    map = this.map;
    $('#location-picker').on('shown.bs.modal', function() {
      $(".action-overlay").show();
      $("#location-error").hide();
      $(".spinner-overlay").hide();
      map.invalidateSize();
      return $("#save-location-button").prop("disabled", true);
    });
    return this;
  };
  BigMap.DEFAULTS = {
    location_url: "",
    lat: null,
    lng: null,
    accesstoken: "",
    admin: 0,
    mapid: "",
    locationurl: "",
    orig_lat: null,
    orig_lng: null,
    wobble: false
  };
  BigMap.prototype.set_coords = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    return $("#save-location-button").prop("disabled", false);
  };
  BigMap.prototype.place = function() {
    var marker_dragged, moptions, that;
    that = this;
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.map.setView([this.lat, this.lng]);
    moptions = {};
    if (this.options.admin === 1) {
      moptions = {
        draggable: true
      };
    }
    this.marker = L.marker([this.lat, this.lng], moptions).addTo(this.map);
    marker_dragged = function(e) {
      var result;
      result = that.marker.getLatLng();
      that.lat = result.lat;
      that.lng = result.lng;
      $("#tmp_lat").val(result.lat);
      return $("#tmp_lng").val(result.lng);
    };
    return this.marker.on("dragend", marker_dragged);
  };
  BigMap.prototype.random = function() {
    var c, that, x, y;
    x = (Math.random() - 0.5) / 100;
    y = (Math.random() - 0.5) / 100;
    c = this.map.getCenter();
    c.lat = c.lat + x;
    c.lng = c.lng + y;
    this.map.panTo(c);
    that = this;
    if (this.wobble) {
      return setTimeout(function() {
        return that.random();
      }, 300);
    }
  };
  BigMap.prototype.lookup = function(street, zip, city, country, callback) {
    $("#location-loader").show();
    $("#action-overlay").hide();
    $(".spinner-overlay").show();
    $("#location-error-box").hide();
    $(".loader").show();
    this.wobble = true;
    this.random();
    bm = this;
    return $.ajax({
      url: this.options.locationurl,
      type: "GET",
      data: $.param({
        city: city,
        zip: zip,
        street: street,
        country: country
      }),
      success: function(data) {
        $(".loader").hide();
        bm.wobble = false;
        if (!data.success) {
          $("#location-error-box").show();
          $("#location-error").text(data.msg).show();
          return;
        }
        $(".action-overlay").show();
        $("#location-error").hide();
        $(".spinner-overlay").hide();
        $("#save-location-button").prop("disabled", false);
        bm.lat = data.lat;
        bm.lng = data.lng;
        bm.orig_lat = data.lat;
        bm.orig_lng = data.lng;
        bm.place();
        if (callback) {
          return callback(data);
        }
      },
      error: function(data) {
        console.log("error");
        $("#location-error-box").show();
        $("#location-error").text("an unknown error occurred, please try again").show();
        $("#location-error").show();
        $(".action-overlay").hide();
        $(".loader").hide();
        return bm.wobble = false;
      }
    });
  };
  Plugin = function(option) {
    var func_arguments;
    func_arguments = arguments;
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('bc.bigmap');
      options = $.extend({}, BigMap.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        bm = new BigMap(this, options);
        $this.data('bc.bigmap', bm);
      }
      if (typeof option === 'string') {
        func_arguments = $.map(func_arguments, function(value, index) {
          return [value];
        });
        return data[option].apply(data, func_arguments.slice(1));
      }
    });
  };
  old = $.fn.bigmap;
  $.fn.bigmap = Plugin;
  $.fn.bigmap.Constructor = BigMap;
  return $.fn.modal.noConflict = function() {
    $.fn.bigmap = old;
    return this;
  };
};

bm(jQuery);

$(document).ready(function() {
  $(".urlscheme").limitchars();
  $(".form-validate").validate({
    noshowErrors: function(errorMap, errorList) {
      var form, position;
      console.log("error");
      $.each(this.successList, function(index, value) {
        $(value).removeClass("has-error");
        return $(value).popover('hide');
      });
      form = this.currentForm;
      position = $(form).data("errorposition") || 'right';
      return $.each(errorList, function(index, value) {
        var _popover;
        _popover = $(value.element).popover({
          trigger: 'manual',
          placement: position,
          content: value.message,
          template: '<div class="popover error"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        _popover.data('popover').options.content = value.message;
        $(value.element).addClass("has-error");
        return $(value.element).popover('show');
      });
    }
  });
  $("#sponsor-form").validate({
    rules: {
      "upload-value-id": {
        required: true
      }
    },
    submitHandler: function(form) {
      if ($(form).find("#image").val()) {
        return form.submit();
      } else {
        return alert("Bitte lade ein Logo hoch");
      }
    },
    highlight: function(label) {
      return $(label).closest('.form-group').addClass('has-error');
    },
    success: function(label) {
      return label.text('').closest('.form-group').removeClass("has-error").addClass('has-success');
    }
  });
  $(".action-confirm").click(function() {
    var confirm_msg;
    confirm_msg = $(this).data("confirm");
    if (confirm(confirm_msg)) {
      return true;
    }
    return false;
  });
  $('body').on("click.editable", '[data-toggle="editable"]', function(e) {
    return $(e.target).editable();
  });
  $(".datetime-widget .time").timepicker({
    timeFormat: "G:i",
    show24: true
  });
  $('.datetime-widget .date').datepicker({
    format: 'd.m.yyyy',
    autoclose: true,
    language: $("body").data("lang")
  });
  $('.datetime-widget').publish_date();
  $(".view-edit-group").view_edit_group();
  $('.change-state').click(function() {
    var state, url;
    url = $(this).data("url");
    state = $(this).data("state");
    return $.ajax({
      url: this.url,
      type: 'POST',
      data: {
        state: state,
        field: field
      },
      success: (function(_this) {
        return function(data) {
          _this.payload = $(_this.elem).html();
          $(_this.elem).html(data.html);
          return _this.escape();
        };
      })(this)
    });
  });
  tinyMCE.baseURL = "/static/js/components/tinymce/";
  tinymce.init({
    selector: '.wysiwyg',
    menubar: false,
    toolbar: "undo redo | formatselect | bold italic | bullist | numlist | blockquote | removeformat",
    content_css: "/static/css/tinymce.css"
  });
  $("#bigmap").bigmap();
  $("#show-on-map").click(function() {
    var city, country, lat, lng, street, zip;
    street = $('#location_street').val();
    zip = $('#location_zip').val();
    city = $('#location_city').val();
    country = $('#location_country').val();
    if (street === "") {
      $('#error-street').popover("show");
      return;
    }
    if (city === "") {
      $('#error-street').popover("show");
      return;
    }
    $("#location-picker").modal("show");
    if ($("#location_lat").val()) {
      lat = $("#location_lat").val();
      lng = $("#location_lng").val();
      $("#bigmap").bigmap("set_coords", lat, lng);
      $("#bigmap").bigmap("place");
    } else {
      $("#bigmap").bigmap("lookup", street, zip, city, country);
    }
    return false;
  });
  $("#location-error-confirm").click(function() {
    $("#location-error-box").hide();
    return $("#location-picker").modal("hide");
  });
  return $("#save-location-button").click(function() {
    $("#location_lat").val($("#tmp_lat").val());
    $("#location_lng").val($("#tmp_lng").val());
    $("#own_coords").val("yes");
    return $("#location-picker").modal("hide");
  });
});
