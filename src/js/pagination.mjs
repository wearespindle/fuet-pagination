/**
 * Simple Vue pagination component.
 * @returns {Object} - The Vue component attributes.
 */
export function Pagination(template) {
    return {
        /**
        * The default component context.
        * @returns {Object} - Properties of the paginator component.
        */
        computed: {
            nextEnabled: function() {
                if (this.currentPage < this.pageCount) return true
                else return false
            },
            pageCount: function() {
                return Math.ceil(this.count / this.pageSize)
            },
            prevEnabled: function() {
                if (this.currentPage > 1) return true
                else return false
            },
        },
        created: function() {
            // SSR uses this hook.
            this.currentPage = parseInt(this.$router.currentRoute.query.page) || 1
            this.updatePagination(this.currentPage, this.count)
        },
        data: function() {
            return {
                currentPage: 1,
                lastPage: 1,
                pageSize: 10,
                relativePageSize: 6,
                renderPages: [],
            }
        },
        methods: {
            fetchPage: async function(pageNumber) {
                if (!pageNumber) pageNumber = this.currentPage
                else {
                    this.currentPage = pageNumber
                }

                this.updatePagination(this.currentPage)
                await this.method({page: pageNumber, path: this.path})
            },
            /**
            * Update the pagination component state.
            * @param {Number} currentPage - Used to determine the next page.
            */
            updatePagination: function(currentPage) {
                let renderPages = []

                const middleNav = Math.floor(this.relativePageSize / 2)
                // Start showing pages relative to current page when the current
                // page exceeds the middle page.
                const showrelativePageSize = currentPage > middleNav
                const pagesInNavRange = this.pageCount < this.relativePageSize
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
                        if (i > 0 && i <= this.pageCount) {
                            renderPages.push(i)
                        }
                    }
                } else {
                    // Render until pageCount or relativePageSize max.
                    let _r
                    if (this.pageCount > this.relativePageSize) _r = this.relativePageSize
                    else _r = this.pageCount
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
                if (lastPage === (this.pageCount - 1)) {
                    // Add last page to the relative pages when the last rendered
                    // relative page is a direct neighbour of the last page
                    // in total.
                    renderPages.push(this.pageCount)
                    this.ellipsisLast = null
                } else if (lastPage <= (this.pageCount - 2)) {
                    // Add last page as an ellipsis link when the last rendered
                    // relative page is more than 1 page away.
                    this.ellipsisLast = this.pageCount
                } else {
                    this.ellipsisLast = null
                }

                this.currentPage = currentPage
                this.renderPages = renderPages
            },
        },
        props: [
            'count',
            'method',
            'path',
        ],
        render: template.r,
        staticRenderFns: template.s,
        watch: {
            count: function(newCount) {
                this.currentPage = parseInt(this.$router.currentRoute.query.page) || 1
                this.updatePagination(this.currentPage)
            },
        },
    }
}
