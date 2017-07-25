import '../css/EditPresetDialog.scss';
import React from 'react';
import FormDialog from './FormDialog';
import ProcessingNodeOption from './ProcessingNodeOption';
import PresetUtils from '../classes/PresetUtils';
import $ from 'jquery';

class EditPresetDialog extends React.Component {
    static defaultProps = {
    };

    static propTypes = {
        preset: React.PropTypes.object.isRequired,
        availableOptions: React.PropTypes.array.isRequired,
        saveAction: React.PropTypes.func.isRequired,
        deleteAction: React.PropTypes.func.isRequired,
        onHide: React.PropTypes.func
    };

    constructor(props){
        super(props);

        // Refs to ProcessingNodeOption components
        this.options = {};

        this.state = {
            name: props.preset.name
        };

        this.getFormData = this.getFormData.bind(this);
        this.onShow = this.onShow.bind(this);
        this.setOptionRef = this.setOptionRef.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.isCustomPreset = this.isCustomPreset.bind(this);
    }

    setOptionRef(optionName){
        return (component) => {
            if (component) this.options[optionName] = component;
        }
    }

    getOptions(){
        return Object.values(this.options)
          .map(option => {
            return {
              name: option.props.name,
              value: option.getValue()
            };
          })
          .filter(option => option.value !== undefined);
    }

    getFormData(){
      return {
        id: this.props.preset.id,
        name: this.state.name,
        options: this.getOptions()
      };
    }

    isCustomPreset(){
        return this.props.preset.id === -1;
    }

    onShow(){
      if (!this.isCustomPreset()) this.nameInput.focus();
    }

    handleChange(field){
      return (e) => {
        let state = {};
        state[field] = e.target.value;
        this.setState(state);
      }
    }

    render(){
        let options = PresetUtils.getAvailableOptions(this.props.preset.options, this.props.availableOptions);

        return (
            <div className="edit-preset-dialog">
                <FormDialog {...this.props}
                    getFormData={this.getFormData} 
                    reset={() => {}}
                    show={true}
                    onShow={this.onShow}
                    saveIcon="fa fa-edit"
                    title="Edit Options"
                    saveAction={this.props.saveAction}
                    deleteWarning={false}
                    deleteAction={(this.props.preset.id !== -1 && !this.props.preset.system) ? this.props.deleteAction : undefined}>
                  {!this.isCustomPreset() ? 
                    <div className="row preset-name">
                        <label className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-10">
                          <input type="text" className="form-control" ref={(domNode) => { this.nameInput = domNode; }} value={this.state.name} onChange={this.handleChange('name')} />
                        </div>
                    </div>
                  : ""}
                  <div className="row">
                    <label className="col-sm-2 control-label">Options</label>
                    <div className="col-sm-10">
                    {options.map(option =>
                        <ProcessingNodeOption {...option}
                          key={option.name}
                          ref={this.setOptionRef(option.name)} /> 
                    )}
                    </div>
                  </div>
                </FormDialog>
            </div>
        );
    }
}

export default EditPresetDialog;