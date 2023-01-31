import { IsNullOrEmpty } from '/js/iuf.js'

/*
 * Rivet Badge
 *
 * Icon support via Rivet Icons: https://indiana-university.github.io/rivet-icons/
 *
 * Usage: <badge :value="Test" variant="info"></badge>
 *        <badge v-model="modelVariable" variant="warning"></badge>
 *        <badge value="Test" background-color="green" foreground-color="white" icon="magnifying-glass"></badge>
 *        <badge value="Error" background-color="red" foreground-color="white" icon="close-circle"></badge>
 */
export default {
    name: 'Badge',
    props: ['value', 'modelValue', 'variant', 'compact', 'background-color', 'foreground-color', 'icon'],
    data() {
        return {
            internalValue: this.value
        }
    },
    computed: {
        /*
         * The computed CSS class based on the variant if a standard variant is used.
         */
        cssClass() {
            let css = 'rvt-badge rvt-badge--' + this.variant;

            if (this.compact ? true : false) {
                css = css + " rvt-c-radius-sm";
            }

            return css;
        },
        /*
         * Dynamic style based on the input of properties like the background and foreground colors.
         */
        dynamicStyle() {
            let styleStr = "";

            if (!IsNullOrEmpty(this.backgroundColor)) {
                styleStr += `background: ${this.backgroundColor} !important; border-color: ${this.backgroundColor};`;
            }

            if (!IsNullOrEmpty(this.foregroundColor)) {
                styleStr += `color: ${this.foregroundColor} !important;`;
            }

            console.log(styleStr);

            return styleStr;
        },
        /*
         * The display value for the text that is shown inside the badge.
         */
        displayValue() {
            return !IsNullOrEmpty(this.modelValue) ? this.modelValue : this.value;
        },
        /*
         * The name of a Rivet Icon to show.
         */
        showIcon() {
            return !IsNullOrEmpty(this.icon);
        }
    },
    template: `
    <span :class="cssClass" :style="dynamicStyle"><rvt-icon :name="icon" v-if="showIcon" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"></rvt-icon>{{displayValue}}</span>
    `
};