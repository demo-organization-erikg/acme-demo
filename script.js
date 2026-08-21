/* ==========================================================================
   Acme Industries - Engineering Team Info
   Everything here is an enhancement. The page is complete and readable
   with JavaScript switched off; this file only makes it nicer to use.
   ========================================================================== */

(function () {
  "use strict";

  var people = Array.prototype.slice.call(document.querySelectorAll("[data-person]"));

  /* ---------------------------------------------------------- Headcount */

  var count = document.getElementById("count");
  if (count) {
    count.textContent = people.length + " people on the team.";
  }

  /* ------------------------------------------------------------- Filter */

  var wrap = document.getElementById("filter-wrap");
  var input = document.getElementById("filter");
  var noResults = document.getElementById("no-results");

  if (wrap && input) {
    // The box is hidden in the HTML so it never appears without working code.
    wrap.hidden = false;

    // Cache the searchable text once instead of reading the DOM on every keystroke.
    var index = people.map(function (card) {
      var team = card.closest(".team");
      var teamName = team ? team.querySelector(".team-name").textContent : "";
      return {
        card: card,
        text: (card.textContent + " " + teamName).toLowerCase()
      };
    });

    var applyFilter = function () {
      var term = input.value.trim().toLowerCase();
      var shown = 0;

      index.forEach(function (entry) {
        var match = term === "" || entry.text.indexOf(term) !== -1;
        entry.card.hidden = !match;
        if (match) { shown += 1; }
      });

      if (noResults) { noResults.hidden = shown !== 0; }

      if (count) {
        count.textContent = term === ""
          ? people.length + " people on the team."
          : "Showing " + shown + " of " + people.length + ".";
      }
    };

    input.addEventListener("input", applyFilter);

    // Escape clears the box.
    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        input.value = "";
        applyFilter();
      }
    });
  }

  /* --------------------------------------------------------- Copy email */

  // Only offer this where the browser can actually do it. Clipboard access
  // needs a secure context, so it is absent on a plain http page by design.
  if (navigator.clipboard && window.isSecureContext) {
    people.forEach(function (card) {
      var link = card.querySelector(".email");
      if (!link) { return; }

      var address = link.textContent.trim();
      var name = card.querySelector(".name").textContent.trim();

      var button = document.createElement("button");
      button.type = "button";
      button.className = "copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy the email address for " + name);

      button.addEventListener("click", function () {
        navigator.clipboard.writeText(address).then(function () {
          button.textContent = "Copied";
          button.setAttribute("data-done", "yes");
          window.setTimeout(function () {
            button.textContent = "Copy";
            button.removeAttribute("data-done");
          }, 1500);
        }).catch(function () {
          button.textContent = "Press Ctrl+C";
        });
      });

      // Keep the address and the button on one line, wrapping together
      // on a narrow screen.
      var row = document.createElement("p");
      row.className = "contact";
      link.parentNode.insertBefore(row, link);
      row.appendChild(link);
      row.appendChild(button);
    });
  }
}());
