<nav class="pagination" v-if="renderPages.length > 1">
    <a class="pagination-previous" :disabled="!previous" @click=fetchData(previous)>{{$t('Previous')}}</a>
    <a class="pagination-next" :disabled="!next" @click=fetchData(next)>{{$t('Next')}}</a>
    <ul class="pagination-list">
        <template v-if=ellipsisFirst>
            <li @click=fetchData(ellipsisFirst)>
                <a class="pagination-link">{{ellipsisFirst}}</a>
            </li>
            <li class="pagination-ellipsis">...</li>
        </template>
        <li v-for="(n, index) in renderPages">
            <a class="pagination-link"
                @click=fetchData(n)
                :class="{'is-current': n === currentPage}">
            {{ n }}
            </a>
        </li>
        <template v-if=ellipsisLast>
        <li class="pagination-ellipsis">...</li>
        <li @click=fetchData(ellipsisLast)>
            <a class="pagination-link">{{ellipsisLast}}</a>
        </li>
        </template>
    </ul>
</nav>
