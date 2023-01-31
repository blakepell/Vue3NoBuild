export default {
    name: 'InputText',
    props: {
        name: { type: String, required: false },
        id: { type: String, required: false },
        label: { type: String, required: false },
        type: { type: String, required: false, default: "text" },
        modelValue: { type: String, required: false },
        maxLength: { type: Number, required: false },
        required: { type: Boolean, required: false },
        title: { type: String, required: false },
        placeholder: { type: String, required: false },
        disabled: { type: Boolean, required: false },
        readonly: { type: Boolean, required: false },
        style: { type: String, required: false },
        minimalValidationCss: { type: Boolean, required: false },
        requireUnlockToEdit: { type: Boolean, required: false, default: false }
    },
    emits: ['update:modelValue', 'blur'],
    data() {
        return {
            charsLeft: this.maxLength,
            isValid: false,
            locked: false
        }
    },
    mounted() {
        this.update();

        if (this.requireUnlockToEdit) {
            this.locked = true;
        }
    },
    watch: {
        modelValue() {
            this.update();
        }
    },
    methods: {
        update() {
            let currentLength = 0;

            if (this.modelValue) {
                currentLength = this.modelValue.length;
            }

            this.charsLeft = this.maxLength - currentLength;

            if (currentLength > 0) {
                this.isValid = true;
            }
            else {
                this.isValid = false;
            }
        }
    },
    computed: {
        cssInput() {
            if (this.minimalValidationCss) {
                return "rvt-text-input";
            }

            if (this.isValid && this.required) {
                return "rvt-text-input rvt-validation-success";
            }
            else if (!this.isValid && this.required) {
                return "rvt-text-input rvt-validation-danger";
            }
            else {
                return "rvt-text-input";
            }
        },
        showCharsLeft() {
            if (this.type !== "date" && this.modelValue !== null) {
                return true;
            }

            return false;        }
    },
    template: `
    <div class="rvt-flex">
        <div class="rvt-grow-1 rvt-items-center rvt-m-right-sm">
            <label class="rvt-label" :for="name">{{label}}</label>
            <span style='color: red;' v-if="required && !this.isValid">*</span>
            <label class="rvt-label" :for="name" v-if="readonly" style="margin-left: 5px;">(Read Only)</label>
        </div>
        <div class="rvt-items-center">
            <label class="rvt-label" :for="name" v-if="showCharsLeft">{{charsLeft}}/{{maxLength}}</label>
        </div>
    </div>

    <div class="rvt-input-group">
    <input :type="type"
            :value="modelValue" 
            @input="$emit('update:modelValue', $event.target.value)"
            @blur="$emit('blur')"
            :class="cssInput"
            :style="style"
            :placeholder="placeholder"
            :disabled="disabled || locked ? true : null"
            :readonly="readonly ? true : null"
            :required="required ? true : null"
            :maxlength="maxLength"
            :title="title"
            :id="id"
            :name="name" />

        <div class="rvt-input-group__append" v-if="requireUnlockToEdit">
            <button type="button" class="rvt-button" title="Unlock to Edit"
                @click="this.locked = !this.locked"
                v-if="locked">
                <rvt-icon name="lock-closed"></rvt-icon>
            </button>

            <button type="button"
                class="rvt-button"
                @click="this.locked = !this.locked"
                v-if="!locked">
                <rvt-icon name="lock-open"></rvt-icon>
            </button>
        </div>
    </div>
    `
};