import React from "react";

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
        this.state = {
            name: 'Файл://',
            isActive: false,
        }
    }

    changeHandler(evt) {
        const name = evt.target.files[0] ? evt.target.files[0].name : 'Файл://';

        this.setState({
            name: name,
            isActive: Boolean(evt.target.files[0]),
        });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        let file = this.fileInput.current.files[0];
        let reader = new FileReader();

        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            this.props.updateHero(JSON.parse(evt.target.result));
        }
    }

    render() {
        return (
            <form className="upload-form" onSubmit={this.handleSubmit}>
                <label className="custom-file">
                    {this.state.name}
                    <input className="visually-hidden"
                           type="file"
                           onChange={this.changeHandler.bind(this)}
                           ref={this.fileInput} />
                </label>
                <br />
                <button className="upload-form__button custom-button"
                        type="submit" disabled={!this.state.isActive}>Загрузить</button>
            </form>
        );
    }
}

export default FileInput;