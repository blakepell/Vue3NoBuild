export default {
    name: 'AlertCard',
    props: {
        title: { type: String, required: false, default: "Alert" },
        text: { type: String, required: false, default: "No text was set for this alert card." },
        backgroundColor: { type: String, required: false, default: "rvt-bg-orange-000" },
        foregroundColor: { type: String, required: false, default: "rvt-color-orange-500" }
    },
    data() {
        return {
        }
    },
    template: `            
        <div class="rvt-card rvt-card--raised rvt-c-card--dont [ rvt-m-bottom-md rvt-grow-1 ] rvt-m-tb-xs">
            <div class="rvt-flex rvt-items-center rvt-bg-orange-000 rvt-color-orange-500 rvt-p-tb-md rvt-p-lr-md">
                    <svg class="rvt-m-right-xs" width="24" height="24" viewBox="0 0 16 16">
                      <g fill="currentColor">
                        <path d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,2a6,6,0,1,0,6,6A6,6,0,0,0,8,2Z"/>
                        <path d="M8,12a1,1,0,0,1-1-1V8A1,1,0,0,1,9,8v3A1,1,0,0,1,8,12Z"/>
                        <circle cx="8" cy="5" r="1"/>
                      </g>
                    </svg>
                    <h2 class="rvt-ts-23 rvt-text-medium" style="padding-top: 3px;">{{title}}</h2>
            </div>
            <div class="rvt-p-all-md rvt-prose">
                <ul>
                    <li>{{text}}</li>
                </ul>
            </div>
        </div>
    `
};