import { lists } from '../services/getList'
import { uniqueFunc } from '../views/utils/index'
const goodsList = {
    namespace: 'list',
    state: {
        list: [],
        loading:false
    },
    reducers: {
        setList (state, { data}) {
            return {
                list:uniqueFunc(data, 'id'),
            }
        },
    },
    effects: {
        // 初始化数据
        *initList ({payload,flag} , { call, put, select }) {
            console.log(flag,'0-')
            // let { list } = yield JSON.parse(localStorage.getItem('persist:model'))
            // !list.list.length || 
            // if (flag) {
                const { data } = yield call(lists, payload);
                yield put({ type: 'setList', data: data.list })
            // }
        },
        // 筛选大小  此处可写在 reducers内
        *filterSize ({ checks }, { call, put, select }) {
            let filters = [];
            let filtersSzies = yield select(({ list }) => {
                checks.map(v => {
                    list.list.map(item => {
                        if (item.availableSizes.includes(v)) filters.push(item)
                    })
                })
                return filters
            })
            yield put({ type: 'setList', data: filtersSzies })
        },
        // 排序
        *sort ({ sort }, { call, put, select }) {
            let sorts = []
            if (sort === 'asc') {
                yield select(({ list }) => {
                    sorts = list.list.sort((a, b) => a.price - b.price)
                })
            }
            if (sort === 'desc') {
                yield select(({ list }) => {
                    sorts = list.list.sort((a, b) => b.price - a.price)
                })
            }
            yield put({ type: 'setList', data: sorts })
        }
    },
}
export default goodsList