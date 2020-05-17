import Vue from 'vue'
import KFUMaps from '@/components/KFUMaps.vue'

describe('KFUMaps.vue', () => {
    it('displays default message', () => {
        const Ctor = Vue.extend(KFUMaps)
        const vm = new Ctor().$mount()

        expect(vm.$el.textContent).toContain('')
    })
})

