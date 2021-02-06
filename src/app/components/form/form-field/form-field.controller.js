function formFieldController($translate) {
  var ctrl = this;

  const unlabeledFields = ['OCULTO', 'RELACION', 'SECCION'];

  ctrl.$onInit = () => {
    ctrl.isFocused = false;
  };

  ctrl.$onChanges = (changes) => {
    if (changes.metadata) {
      ctrl.metadata = angular.copy(ctrl.metadata);
      setInitAttrs();
    }
    if (changes.parentModel) {
      ctrl.parentModel = angular.copy(ctrl.parentModel);
      setDependantData();
      handleConditionalShow();
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
      handleDefaultValue();
    }
  };

  ctrl.updateModel = (event) => {
    handleCustomValidation();
    ctrl.isFocused = event.isFocused;
    let newEvent = {};
    if (event.value !== ctrl.model) {
      newEvent.name = event.name;
      newEvent.value = event.value;
    }
    if (!angular.equals(ctrl.parentModel[event.entityName], event.entity)) {
      newEvent.entityName = event.entityName;
      newEvent.entity = event.entity;
    }
    if (!angular.equals(newEvent, {})) {
      ctrl.onChange({
        $event: newEvent,
      });
    }
  };

  const setInitAttrs = () => {
    ctrl.show = true;
    if (ctrl.metadata.nomCampo === 'dependeLookup') {
      ctrl.show = false;
    }
    ctrl.metadata.elementId = ctrl.metadata.cveForma + ctrl.metadata.nomCampo;
    // get translated data
    const namespace = ctrl.metadata.cveForma;
    // label
    ctrl.metadata.hasLabel = !(
      unlabeledFields.indexOf(ctrl.metadata.cveTipoComponente) > -1
    );
    // get label
    $translate(`${namespace}.${ctrl.metadata.cveEtiqueta}`).then(
      (trans) => (ctrl.metadata.labelText = trans),
      (transId) =>
        (ctrl.metadata.labelText = ctrl.metadata.txEtiqueta || transId)
    );
    // get help
    if (ctrl.metadata.cveAyuda || ctrl.metadata.txAyuda) {
      $translate(
        `${namespace}.${ctrl.metadata.cveAyuda}`,
        {},
        undefined,
        undefined,
        false,
        'sce'
      )
        .then((trans) => (ctrl.metadata.helpText = trans))
        .catch(
          (transId) =>
            (ctrl.metadata.helpText = ctrl.metadata.txAyuda || transId)
        );
    }
  };

  const setDependantData = () => {
    const dependantName = ctrl.metadata.nomCampoDependiente;
    if (!dependantName) {
      return;
    }
    if (dependantName.startsWith('lk')) {
      ctrl.metadata.isDisabled = true;
      if (!angular.equals({}, ctrl.parentModel)) {
        let dependantValue = ctrl.parentModel;
        if (dependantName.includes('.')) {
          dependantName.split('.').forEach((key) => {
            if (dependantValue && !angular.equals({}, dependantValue)) {
              dependantValue = dependantValue[key];
            } else {
              dependantValue = undefined;
            }
          });
        } else {
          dependantValue = dependantValue[dependantName];
        }
        ctrl.updateModel({
          name: ctrl.metadata.nomCampo,
          value: dependantValue,
        });
      }
      return;
    }
  };

  const handleDefaultValue = () => {
    if (
      (ctrl.model === undefined || ctrl.model === null) &&
      ctrl.metadata.valorInicial
    ) {
      let defaultValue = ctrl.metadata.valorInicial;
      if (defaultValue.startsWith('js')) {
        // TODO: Implementar funcionalidad para obtener el valor default a través de una función Javascript
        defaultValue = undefined;
      }
      if (defaultValue === 'true') {
        defaultValue = true;
      }
      if (defaultValue === 'false') {
        defaultValue = false;
      }
      ctrl.updateModel({
        name: ctrl.metadata.nomCampo,
        value: defaultValue,
      });
    }
  };

  const handleConditionalShow = () => {
    if (ctrl.metadata.fnMuestra) {
      ctrl.show = false;
      const fnBody = ctrl.metadata.fnMuestra;
      const showingFn = new Function('value', 'model', fnBody);
      ctrl.show = showingFn(ctrl.model, ctrl.parentModel);
    }
  };

  const handleCustomValidation = () => {
    // TODO: Implementar funcionalidad para generar validaciones personalizadas
    return true;
  };
}

angular
  .module('components.form')
  .controller('formFieldController', formFieldController);
