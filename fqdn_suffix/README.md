# FQDN Suffix Parser

Uses [psl](https://www.npmjs.com/package/psl) to parse FQDNs, taking into account public suffixes from the [Public Suffix List](http://publicsuffix.org/). Ret
urns an output field that is an object containing:
* tld: Top level domain (public suffix)
* sld: Second level domain (the first private part of the domain name).
* domain: sld + tld
* subdomain: parts of the FQDN to the left of the domain
