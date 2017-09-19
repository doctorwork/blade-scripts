export default {
    data: function () {
        return {
            'current': '',
            "view": {
                template: "<div>loading</div>"
            }
        }  
    },
    beforeRouteEnter: function (to, from, next) {
        let page = to.name;
    },
    render(h) {
        return h(this.view)
    },
    methods: {
        importModule: function (page) {
            
        }
    }
}
