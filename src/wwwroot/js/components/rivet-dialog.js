export default {
    name: 'Dialog',
    props: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        onOk: { type: Function, required: false },
        onCancel: { type: Function, required: false }
    },
    data() {
        return {
        }
    },
    setup() {
    },
    methods: {
        show() {
            this.$refs["dlg"].open();

            // Prevent the default or the propagation otherwise the click that shows the event
            // will also cause Rivet to hide the dialog.
            event?.stopPropagation();
            event?.preventDefault();
        },
        hide() {
            this.$refs["dlg"].close();

            // Prevent the default or the propagation otherwise the click that shows the event
            // will also cause Rivet to hide the dialog.
            event?.stopPropagation();
            event?.preventDefault();
        }
    },
    template: `
    <div ref="dlg" class="rvt-dialog" id="dialog-example" role="dialog" tabindex="-1" aria-labelledby="dialog-title" aria-describedby="dialog-description" data-rvt-dialog="dialog-example" data-rvt-dialog-modal data-rvt-dialog-darken-page data-rvt-dialog-disable-page-interaction hidden>
      <header class="rvt-dialog__header">
        <h1 class="rvt-dialog__title" id="dialog-title">{{title}}</h1>
      </header>
      <div class="rvt-dialog__body">
        <slot name="default">
        </slot>
      </div>
      <div class="rvt-dialog__controls">
        <button type="button" class="rvt-button" role="button" data-rvt-dialog-close="dialog-example">
        <span>OK</span>
        </button>
        <button type="button" class="rvt-button rvt-button--secondary" data-rvt-dialog-close="dialog-example" role="button">
        <span>Cancel</span>
        </button>
      </div>
      <button class="rvt-button rvt-button--plain rvt-dialog__close" data-rvt-dialog-close="dialog-example" role="button">
        <span class="rvt-sr-only">Close</span>
        <rvt-icon name="close" title="Close"></rvt-icon>
      </button>
    </div>
    `
};