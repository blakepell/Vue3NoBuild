/*
 * Rivet Page Search Button and Dialog.
 *   - Hot-key: Ctrl+S to open.
 *   - Escape: Closes the dialog when open.
 *   - Enter: Submits the search form.
 */
export default {
    name: 'Search',
    props: {
        name: { type: String, required: false, default: "q" },
        action: { type: String, required: false, default: "/search" },
        method: { type: String, required: false, default: "POST" }
    },
    data() {
        return {
            searchVisible: false,
            internalValue: ""
        }
    },
    mounted() {
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 's') {
                // Ctrl+S Hot-key
                this.toggleVisibility();
                event.preventDefault();
            }
            if (event.ctrlKey && event.altKey && event.key === 's') {
                // Ctrl+S Hot-key
                window.location = "/";
                event.preventDefault();
            }
            else if (event.key === 'Escape' && this.searchVisible) {
                // Escape will toggle the visibility off only if the search
                // box is visible.
                this.toggleVisibility();
            }
        });
    },
    methods: {
        /*
         * Toggles the visibility, handles focus and resets the internal value.
         */
        toggleVisibility() {
            this.searchVisible = !this.searchVisible;

            if (this.searchVisible) {
                this.internalValue = "";

                // $nextTick() is used to wait until the DOM has been updated before calling the focus 
                // method to ensure that the element is in the DOM.
                this.$nextTick(() => {
                    this.$refs.txtSearch.focus();
                });
            }
        },
        /*
         * Manually opens the search dialog.
         */
        open() {
            this.searchVisible = !this.searchVisible;
            this.toggleVisibility();
        },
        /*
         * Manually closes the search dialog.
         */
        close() {
            this.searchVisible = this.searchVisible;
            this.toggleVisibility();
        }
    },
    template: `
    <div>
        <button class="rvt-global-toggle" data-rvt-disclosure-toggle="search" aria-expanded="false" @click="toggleVisibility()" title="Search: Ctrl+S">
            <span class="rvt-sr-only">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="rvt-global-toggle__search" height="16" viewBox="0 0 16 16" width="16">
                <path d="M15.71,14.29,10.89,9.47a6,6,0,1,0-1.42,1.42l4.82,4.82a1,1,0,0,0,1.42,0A1,1,0,0,0,15.71,14.29ZM6,10a4,4,0,1,1,4-4A4,4,0,0,1,6,10Z" fill="currentColor"></path>
            </svg>
        </button>
        <form :action="action" class="rvt-header-global__search" role="search" :method="method" v-show="this.searchVisible">
            <label class="rvt-sr-only" for="search">Search</label>
            <div class="rvt-input-group">
                <input class="rvt-input-group__input rvt-text-input"
                       type="text"
                       :name="name" 
                       v-model="this.internalValue"
                       autocomplete="off"
                       ref="txtSearch"
                       style="margin-left: 5px;">
                <div class="rvt-input-group__append">
                    <button class="rvt-button">Search</button>
                </div>
            </div>
        </form>
    </div>
    `
};