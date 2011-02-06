/*
 * use: A jQuery plugin adding a 'use' property to $
 *
 * Copyright (c) 2010 Holger Seelig
 * Licensed under the GPL license:
 * http://www.gnu.org/licenses/gpl.html
 * 
 * NAME
 *     $.use - load a script from within a script
 *
 * SYNOPSIS
 *     var success = $.use(path);
 *
 * DESCRIPTION
 *
 * Loads a script from within a script if needed.
 * It returns true if the script is ready to use, otherwise it returns false.
 * If the same script is previously successfully loaded, it will not be loaded
 * anymore (and not executed), but $.use will return true. There is a
 * $.use.INC[] object with key -> value pairs of the urls loades. The keys are
 * urls and the values are boolean values for success. Scripts loaded via the
 * <script> tag are found and added to $.use.INC[], I assume they are
 * successfully loaded. The 'path' argument can either be an absolute path or an
 * relative path. BUT relative paths only work when you load the script file
 * (that uses $.use) in the html page also with $.use.
 *
 * EXAMPLE
 * FILE
 *     use.html
 *
 * CODE
 * <html>
 *   <head>
 *     <script type="text/javascript" src="lib/jquery/jquery.js"></script>
 *     <script type="text/javascript" src="lib/jquery/jquery.use.js"></script>
 *     <script type="text/javascript">$.use("../path/to/script.js");</script>
 *   </head>
 * </html>
 *
 * FILE
 *     script.js
 *
 * CODE
 * $.use("../path/to/another-script.js"); // relative path;
 * $.use("other.js"); // other.js is in the same directory as script.js
 * $.use("./other.js"); // won't be loaded again, but returns true
 * ...
 * var CAN_EXAMPLE = $.use("http://example.com/script.js");
 * $.use("http://example.com/remote.js") || $.use("local.js");
 * ...
 * if ($.browser.mozilla)
 *    $.use("mozilla.js");
 * $.browser.webkit && $.use("webkit.js");
 * ...
 * // now you can use the functions defined in your scripts above
 *
 * KNOWN ISSUES
 *
 * Importing a local file like '$.use("file:///path/to/script.js");' only works
 * with firefox AFAIK. 
 *
 * VERSION
 *     1.0.2
 *
 * AUTHOR
 *     Holger Seelig <holger.seelig@yahoo.de>
 */

(function ($, document)
{
	// some basic path manipulation functions first

	// remove slashes from the end
	var rx_sl = /\/+$/;

	// (protocol:)(//)(host)
	var rx_url = /^(\w+?\:)(\/\/)([^\/]*)/;

	var file = $.extend ({},
	{
		exists: function (url)
		{
			var res;
			$.ajax(
			{
				url: url,
				type: "HEAD",
				dataType: "text",
				async: false,
				success: function () { res = true; },
				error: function () { res = false; }
			});
			return res;
		},

		// var dir = dirname (url)
		dirname: function (url)
		{
			var sl = url.replace(rx_sl, "").lastIndexOf("/");
			return sl != -1 ? url.substr(0, sl) : ".";
		},

		// var abs_path = abspath (base, path)
		abspath: function (base, path)
		{
			if (!base || !path)
				return;
	
			// is path an absolute path
			if (rx_url.test(path))
				return path;

			// is base not an absolute path
			if (!rx_url.test(base))
				return;

			// path starts with / (almost an absolute path)
			if (path.charAt(0) == "/")
			{
				// match protocol and host and save this in base
				var m_url = base.match(rx_url);
				base = m_url[1] + m_url[2] + m_url[3];
			}

			base = base.split("/");
			path = path.split("/");
	
			var url = base.splice(0, 3); // move protocol and host to url
			path = base.concat(path);

			for (var i in path)
			{
				switch (path[i])
				{
					case undefined:
					case "":
					case ".":
						break;
					case "..":
						if (url.length > 3)
							url.pop();
						else
							return;
						break;
					default:
						url.push(path[i]);
						break;
				}
			}

			return url.join("/");
		}
	});

	// use core

	var INC   = {};
	var SCOPE = [];

	var rx_jquery = /jquery[\-0-9\.]*(?:\.min)*\.js$/;

	function initialize ()
	{
		var scripts = $("script");
		var self = null;
		try{ self = scripts.last().get()[0]; }
		catch(e){}

		// populate INC with known <script> sources
		scripts.slice(0, scripts.length-1).each(function (i, script)
		{
			var src = script.src;
			if (src)
				INC[src] = rx_jquery.test(src) || file.exists (src);
		});

		if (self) INC[self.src] = true;
	}

	// create $.use
	$.extend (
	{
		use: function (url)
		{
			url = file.abspath(file.dirname(SCOPE.length ? SCOPE[0] : document.URL), url);

			// wrong url
			if (!url)
				return false;

			// not yet loaded
			if (INC[url] === undefined)
			{
				SCOPE.unshift(url);

				$.ajax(
				{
					url: url,
					async: false,
					dataType: "script",
					success: function () { INC[url] = true; },
					error: function () { INC[url] = false; }
				});

				SCOPE.shift();
			}

			// return success or load failed
			return INC[url];
		}
	});

	// create $.use.INC
	$.extend ($.use, { INC: INC });

	// initialize
	initialize ();

})(jQuery, window.document);

