<nav tabindex="-1" class="pagination" v-if="renderPages.length > 1">

    <router-link class="pagination-previous" v-if="currentPage > 1"
        @click.native="fetchPage(currentPage - 1)" :to="path + '?page=' + (currentPage - 1)">
        {{$t('Previous')}}
    </router-link>
    <router-link v-else disabled="disabled" class="pagination-previous" :to="path + '?page=1'">
        {{$t('Previous')}}
    </router-link>

    <router-link class="pagination-next" v-if="currentPage < pageCount"
        @click.native="fetchPage(currentPage + 1)" :to="path + '?page=' + (currentPage + 1)">
        {{$t('Next')}}
    </router-link>
    <router-link v-else disabled="disabled" class="pagination-previous" :to="path + '?page=' + (currentPage + 1)">
        {{$t('Next')}}
    </router-link>

    <ul class="pagination-list">
        <template v-if="ellipsisFirst">
            <li>
                <router-link class="pagination-link" @click.native=fetchPage(ellipsisFirst) :to="path + '?page=' + ellipsisFirst">
                    {{ellipsisFirst}}
                </router-link>
            </li>
            <li class="pagination-ellipsis">...</li>
        </template>

        <li v-for="(n, index) in renderPages">
            <router-link class="pagination-link" @click.native=fetchPage(n) :class="{'is-current': n === currentPage}" :to="path + '?page=' + n">
                {{ n }}
            </router-link>
        </li>

        <template v-if="ellipsisLast">
            <li class="pagination-ellipsis">...</li>
            <li>
                <router-link class="pagination-link" @click.native=fetchPage(ellipsisLast) :to="path + '?page=' + ellipsisLast">
                    {{ellipsisLast}}
                </router-link>
            </li>
        </template>
    </ul>
</nav>
