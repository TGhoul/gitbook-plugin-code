require(['gitbook', 'jQuery'], function(gitbook, $) {

  const TERMINAL_HOOK = '**[terminal]'

  var pluginConfig = {};
  var timeouts = {};

  function addCopyButton(wrapper) {
    wrapper.append(
        $('<i class="fa fa-clone t-copy"></i>')
            .click(function() {
              copyCommand($(this));
            })
    )
    .append(
    	$('<i class="fa fa-files-o t-copy"></i>')
            .click(function() {
              paramCopyCommand($(this));
            })
    );
  }

  function addCopyTextarea() {

    /* Add also the text area that will allow to copy */
    $('body').append('<textarea id="code-textarea" />');
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function copyCommand(button) {
    pre = button.parent();
    textarea = $('#code-textarea');
    textarea.val(pre.text());
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    pre.focus();
    updateCopyButton(button);
  }

  function paramCopyCommand(button) {
    pre = button.parent();
    textarea = $('#code-textarea');
    var copyValue = pre.text().replace("{", "").replace("}", "");
    copyValue = replaceAll(copyValue, '"', '');
    var arr = copyValue.split(",");
    copyValue = "";
    for (var i = 0; i < arr.length; i++) {
      copyValue += arr[i].trim() + "\n";
    }
    textarea.val(copyValue);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    pre.focus();
    updateParamCopyButton(button);
  }

  function initializePlugin(config) {
    pluginConfig = config.code;
  }

  function format_code_block(block) {
    /*
     * Add line numbers for multiline blocks.
     */
    code = block.children('code');
    lines = code.html().split('\n');

    if (lines[lines.length - 1] == '') {
      lines.splice(-1, 1);
    }

    if (lines.length > 1) {
      console.log(lines);
      lines = lines.map(line => '<span class="code-line">' + line + '</span>');
      console.log(lines);
      code.html(lines.join('\n'));
    }

    // Add wrapper to pre element
    wrapper = block.wrap('<div class="code-wrapper"></div>');

    if (pluginConfig.copyButtons) {
      addCopyButton(wrapper);
    }
  }

  function updateCopyButton(button) {
    id = button.attr('data-command');
    button.removeClass('fa-clone').addClass('fa-check');

    // Clear timeout
    if (id in timeouts) {
      clearTimeout(timeouts[id]);
    }
    timeouts[id] = window.setTimeout(function() {
      button.removeClass('fa-check').addClass('fa-clone');
    }, 1000);
  }

  function updateParamCopyButton(button) {
    id = button.attr('data-command');
    button.removeClass('fa-files-o').addClass('fa-check');

    // Clear timeout
    if (id in timeouts) {
      clearTimeout(timeouts[id]);
    }
    timeouts[id] = window.setTimeout(function() {
      button.removeClass('fa-check').addClass('fa-files-o');
    }, 1000);
  }

  gitbook.events.bind('start', function(e, config) {
    initializePlugin(config);

    if (pluginConfig.copyButtons) {
      addCopyTextarea();
    }
  });

  gitbook.events.bind('page.change', function() {
    $('pre').each(function() {
      format_code_block($(this));
    });
  });

});
