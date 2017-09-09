# fuet-pagination
A pagination component for Vue2 using styles from [Bulma](http://bulma.io/).

# Usage
This module depends on npm and commonjs. Just install in your project with:

    npm i fuet-pagination --save

Then include the two components with:

    const {Pagination} = require('fuet-pagination')
    Vue.component('Pagination', Pagination)

Then in the template where you want pagination, use something like:

    <Pagination
        :count=items.count
        :method=fetchData
        :path="$router.currentRoute.path"
    </Pagination>

fetchData is the method being used to retrieve new data when the page changes.
Please [file an issue](https://github.com/wearespindle/fuet-pagination/issues)
if you have feature requests or bug reports.
