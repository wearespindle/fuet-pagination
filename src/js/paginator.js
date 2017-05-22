/**
 * Vue component for pagination that works well with DRF's default
 * pagination style.
 * @param {Object} template - The template to use with this component.
 * @returns {Object} - The Vue component attributes.
 * @class
 */
function Paginator(template) {
    /**
     * The default component context.
     * @returns {Object} - Properties of the paginator component.
     */
    let data = function() {
        return {
            currentPage: 1,
            pageSize: 10,
            renderPages: [],
            relativePageSize: 6,
            lastPage: 1,
        }
    }


    /**
     * Fetches a resource based on a page query string or a page number.
     * @param {String|Number} context - An url to the next page or page number.
     * @param {Boolean} pushRoute - Modifies navigator history when true.
     */
    async function fetchData(context, pushRoute = true) {
        if (!context) return
        let currentPage
        if (typeof context === 'string') {
            let _uri = context.split('?')
            if (_uri.length === 2) {
                currentPage = parseInt(app.utils.parseSearch(_uri[1]).page)
            } else {
                currentPage = 1
            }
        } else {
            currentPage = context
        }
        let _data = await this.$store.dispatch(this.resource_action, {
            resource_url: this.resource_url,
            params: {
                page: currentPage,
            },
        })

        if (pushRoute) {
            const route = this.$router.resolve(this.resource_url).route
            this.$router.push({ name: route.name, query: { page: currentPage }})
        }

        this.updatePagination(currentPage, _data)
    }


    /**
     * Update the pagination component state.
     * @param {Number} currentPage - Used to determine the next page.
     * @param {Object} context - Context to update the pagination with.
     * @param {String} context.count - Total amount of items.
     * @param {String} context.pageSize - Items per page.
     */
    function updatePagination(currentPage, context) {
        let pageCount = Math.ceil(context.count / this.pageSize)
        let renderPages = []
        const middleNav = Math.floor(this.relativePageSize / 2)
        // Start showing pages relative to current page when the current
        // page exceeds the middle page.
        const showrelativePageSize = currentPage > middleNav
        const pagesInNavRange = pageCount < this.relativePageSize
        // Tipping point where to account for in-between.
        if (showrelativePageSize && !pagesInNavRange) {
            // Render halve of the pages before currentPage.
            for (let i = currentPage - middleNav; i < currentPage; i++) {
                if (i > 0) {
                    renderPages.push(i)
                }
            }
            // And the other halve after currentPage.
            for (let i = currentPage; i <= currentPage + middleNav; i++) {
                if (i > 0 && i <= pageCount) {
                    renderPages.push(i)
                }
            }
        } else {
            // Just render until pageCount or relativePageSize max.
            let _r
            if (pageCount > this.relativePageSize) {
                _r = this.relativePageSize
            } else {
                _r = pageCount
            }
            for (let i = 1; i <= _r; i++) renderPages.push(i)
        }

        // Handle first page logic.
        const firstPage = renderPages[0]
        if (firstPage === 2) {
            // Add first to render pages when the first relative page is 2,
            // instead of ellipsing it.
            renderPages.unshift(1)
            this.ellipsisFirst = null
        } else if (firstPage > 2) {
            // Add first page with an ellipsis between, in case it's not
            // a direct neighbour of page two.
            this.ellipsisFirst = 1
        } else {
            // Hide the ellipsis page.
            this.ellipsisFirst = null
        }

        // Handle last page logic.
        const lastPage = renderPages[renderPages.length - 1]
        if (lastPage === (pageCount - 1)) {
            // Add last page to the relative pages when the last rendered
            // relative page is a direct neighbour of the last page in total.
            renderPages.push(pageCount)
            this.ellipsisLast = null
        } else if (lastPage <= (pageCount - 2)) {
            // Add last page as an ellipsis link when the last rendered
            // relative page is more than 1 page away.
            this.ellipsisLast = pageCount
        } else {
            this.ellipsisLast = null
        }

        this.currentPage = currentPage

        if (pageCount !== this.pageCount) {
            this.pageCount = pageCount
        }

        this.renderPages = renderPages
    }


    return {
        render: template.r,
        staticRenderFns: template.s,
        props: ['count', 'next', 'previous', 'resource_action', 'resource_url'],
        data: data,
        methods: {
            fetchData: fetchData,
            updatePagination: updatePagination,
        },
        created: function() {
            this.route = this.$router.resolve(location.href).route
            const page = parseInt(this.route.query.page) || 1
            this.fetchData(page, false)
        },
    }
}

module.exports = Paginator
