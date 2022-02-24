import React from 'react';
import ReactDOM from 'react-dom';
import './sass/style.scss';
import imageSrc from './img/PurpleDuck-Sheet.png'

function Duck(props) {
    return (
        <div
            className={
                `duck 
                ${props.isHit ? 'duck--hurt' : ''} 
                ${props.isJump ? 'duck--jump' : ''}`
            }
            onClick={() => props.onClick()}>
            <div className="duck__sprite-sheet-wrap">
                <img src={imageSrc} className="duck__sprite-sheet" alt={props.name}/>
            </div>
        </div>
    )
}

function Board(props) {
    return (
        <div className="board">
            <div className="board__hero-box">
                <Duck onClick={() => props.onClick()}
                      isHit={props.isHit}
                      isJump={props.isJump} />
            </div>
            <div className="board__health">{`HP ${props.health} / ${props.maxHealth}`}</div>
        </div>
    )
}

function Attributes(props) {
    const ATTRIBUTES = props.attributes;

    return (
        <ul className="attributes">
            {
                ATTRIBUTES ? ATTRIBUTES.map((attribute) => {
                        if (attribute.skills) {
                            return <Attribute
                                key={attribute.name.toString()}
                                name={attribute.name}
                                value={attribute.value}
                                isActive={props.isActive}
                                parentCount={attribute.parentCount}
                                onClick={() => props.onClick(attribute.name.toString())}
                            >
                                <Attributes
                                    attributes={attribute.skills}
                                    isActive={props.isActive}
                                    onClick={props.onClick}
                                />
                            </Attribute>
                        }

                        return <Attribute
                            key={attribute.name.toString()}
                            name={attribute.name}
                            value={attribute.value}
                            isActive={props.isActive}
                            parentCount={attribute.parentCount}
                            onClick={() => props.onClick(attribute.name.toString())}
                        />
                    })
                    : (props.children)
            }
        </ul>
    )
}

function Attribute(props) {
    return (
        <li className="attribute">
            <div className="attribute__inner">
                <span className="attribute__name">{props.name}</span>
                <span className="attribute__value">{props.value}</span>
                <button
                    className={`attribute__btn-inc 
                        ${props.isActive && props.value < 5 ? 'attribute__btn-inc--active' : ''}
                        ${props.value >= props.parentCount ? 'attribute__btn-inc--disabled' : ''}
                        ${props.parentCount}`
                    }
                    onClick={props.onClick}
                >+</button>
            </div>
            {(props.children)}
        </li>
    )
}

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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.fieldName = React.createRef();
        this.state = {
            isActiveBtnSave: false,
            healthHero: 3,
            isHit: false,
            isJump: false,
            hero: {
                name: '',
                freePoints: 25,
                vitality: 3,
                evasion: 10,
                boldness: 0,
                attributes: [
                    {
                        name: "Сила",
                        value: 0,
                        skills: [
                            {
                                parentCount: 0,
                                name: "Атака",
                                value: 0,
                            }
                        ]
                    },
                    {
                        name: "Ловкость",
                        value: 0,
                        skills: [
                            {
                                parentCount: 0,
                                name: "Стелс",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Стрельба из лука",
                                value: 0,
                            },
                        ]
                    },
                    {
                        name: "Интеллект",
                        value: 0,
                        skills: [
                            {
                                parentCount: 0,
                                name: "Обучаемость",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Выживание",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Медицина",
                                value: 0,
                            },
                        ]
                    },
                    {
                        name: "Харизма",
                        value: 0,
                        skills: [
                            {
                                parentCount: 0,
                                name: "Запугивание",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Проницательность",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Внешний вид",
                                value: 0,
                            },
                            {
                                parentCount: 0,
                                name: "Манипулирование",
                                value: 0,
                            },
                        ]
                    },
                ]
            }
        }
    }

    handleClick() {
        if (this.state.healthHero) {
            setTimeout(() => {
                this.setState({
                    isHit: !this.state.isHit,
                })}, 300, 300);

            this.state.healthHero > 1 ?
                this.setState({
                    isHit: !this.state.isHit,
                    healthHero: this.state.healthHero - 1,
                })
                :
                this.setState({
                    isHit: true,
                    isJump: !this.state.isJump,
                    healthHero: 0,
                })
        }
    }

    changeHandler(evt) {
        let duck = Object.assign({}, this.state.hero);
        duck.name = evt.target.value;
        this.setState({
            hero: duck,
            isActiveBtnSave: Boolean(evt.target.value),
        });
    }

    findItem(arr, key) {
        return arr.find((item) => item.name === key)
    }

    handleClickAttribute(key) {
        const HERO = Object.assign({}, this.state.hero);
        const FREE_POINTS = this.state.hero.freePoints;
        const HERO_ATTRIBUTES = this.state.hero.attributes.slice();

        if (FREE_POINTS && HERO_ATTRIBUTES && key) {
            let attr = this.findItem(HERO_ATTRIBUTES, key);

            if (!attr) {
                HERO_ATTRIBUTES.forEach((item) => {
                    let skills = this.findItem(item.skills, key);

                    if (skills) {
                        attr = skills;
                    }
                });
            } else {
                attr.skills.forEach((item) => {
                    item.parentCount++
                })
            }

            if (attr && attr.value < 5) {
                attr.value += 1;
                this.setState({
                    hero: Object.assign(HERO, {
                        vitality: this.findItem(HERO_ATTRIBUTES, 'Сила').value + 3,
                        evasion: this.findItem(HERO_ATTRIBUTES, 'Ловкость').value + 10,
                        boldness: this.findItem(HERO_ATTRIBUTES, 'Ловкость').value + this.findItem(HERO_ATTRIBUTES, 'Интеллект').value,
                        freePoints: FREE_POINTS - 1,
                        attributes: HERO_ATTRIBUTES,
                    })
                });
            }
        }
    }

    updateHero(duck) {
        this.setState({
            hero: duck,
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game__col">
                    <Board onClick={this.handleClick.bind(this)}
                           isHit={this.state.isHit}
                           isJump={this.state.isJump}
                           health={this.state.healthHero}
                           maxHealth={this.state.hero.vitality} />
                    <div className="game__custom-input custom-input">
                        <label htmlFor="user-name" className="custom-input__field-wrap">
                            <input className="custom-input__field"
                                   type="text"
                                   placeholder={'Имя'}
                                   onChange={this.changeHandler.bind(this)}
                                   ref={this.fieldName}
                                   defaultValue={this.state.hero.name} />
                            <span className="custom-input__name">Имя</span>
                        </label>
                    </div>
                    <div className="game__controls">
                        <div className="game__control game__control--right">
                            <a className={`custom-button ${!this.state.isActiveBtnSave ? 'custom-button--hide' : ''}`}
                               type="button"
                               href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                   JSON.stringify(this.state.hero)
                               )}`}
                               download="save.json">Сохранить</a>
                        </div>
                        <div className="game__control">
                            <FileInput updateHero={this.updateHero.bind(this)} />
                        </div>
                    </div>
                </div>
                <div className="game__col">
                    <div className="game__info">
                        <header className="game__header">
                            <h2 className="game__headline headline">Уровень 0: Нетренированный</h2>
                            <div className="game__free-points">{this.state.hero.freePoints}</div>
                        </header>
                        <Attributes>
                            <Attribute name={'Жизненная сила'} value={this.state.hero.vitality} />
                            <Attribute name={'Уклонение'} value={this.state.hero.evasion} />
                            <Attribute name={'Энергичность'} value={this.state.hero.boldness} />
                        </Attributes>
                        <div className="game__headline" />
                        <Attributes
                            attributes={this.state.hero.attributes}
                            isActive={Boolean(this.state.hero.freePoints)}
                            onClick={(key) => this.handleClickAttribute(key)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);