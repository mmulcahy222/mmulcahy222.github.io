# Portfolio, Ironically

The code to make the portfolio is in the portfolio.

I was very happy to first use the Jinja2 Template to make this happen, and I'm thankful for the folks at Jinja for making this happen. I just found out that the maker of Flask web framework was who did Jinja.

Jinja reminds me of the old PHTML Magento templates that I had to work with on a day-to-day basis (PHP)

I am aware that Jinja not only can make Python Websites, but is very handy for Network Configuration & Network Automation, especially when teamed with Netmiko.

Nearly Hands free Network configuration!

Without Jinja, this would have taken too long and it would have been an unpleasant experience

GitHub API was used in the generate_page.py script to get the requisite data to fill up the Jinja Template

The Jinja Template is located in index_template.j2

| File | Purpose |
| ------ | ------ |
| generate_page.py | Script that renders the jinja template |
| index_template.js | The Template itself |