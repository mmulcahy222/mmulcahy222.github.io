# Portfolio, Ironically

The code to make the portfolio is in the portfolio.

I was very happy to first use the Jinja2 Template to make this happen, and I'm thankful for the folks at Jinja for making this happen. I just found out that the maker of Flask web framework was who did Jinja.

Jinja reminds me of the old PHTML Magento templates that I had to work with on a day-to-day basis (PHP)

I am aware that Jinja not only can make Python Websites, but is very handy for Network Configuration & Network Automation, especially when teamed with Netmiko.

Nearly Hands free Network configuration!

Without Jinja, this would have taken too long and it would have been an unpleasant experience

GitHub API was used in the generate_page.py script to get the requisite data to fill up the Jinja Template

The Jinja Template is located in index_template.j2

Inspired by Iris "Blacklight" album and Commodore 64 Typography for warm nostalgic memories. This portfolio showcases web development skills mixed with programming, network & cloud.

For some of the HTML like the GitHub tables of files & links, I made the HTML inside the Python script (the "Controller", not the "View" (Template)) because there was a lot of conditional logic and the view to me wasn't the best place for it, and Jinja syntax wasn't worth it for me with such logic. If there's a better way, let me know, but that's where I decided to tackle that objective. 

| File | Purpose |
| ------ | ------ |
| generate_page.py | Script that renders the jinja template |
| index_template.js | The Template itself |
| assets/js/portfolio.js | Pure JavaScript Code that alerts user as to what project he or she currently looking at  |
| assets/css/style.css | Proprietary CSS styles for entire page |
| assets/css/python_code.css | CSS for highlighted Python Code. This is the default GitHub CSS for Python Code, with the colors changed by me |
