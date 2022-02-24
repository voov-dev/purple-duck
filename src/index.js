import React from 'react';
import ReactDOM from 'react-dom';
import './sass/style.scss';
import Board from "./components/Board";
import FileInput from "./components/FileInput";
import {Attributes, Attribute} from "./components/Attributes";

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
        let heroDuck = Object.assign({}, this.state.hero);
        heroDuck.name = evt.target.value;
        this.setState({
            hero: heroDuck,
            isActiveBtnSave: Boolean(evt.target.value),
        });
    }

    findItem(arr, key) {
        return arr.find((item) => item.name === key)
    }

    handleClickAttribute(key) {
        const heroDuck = Object.assign({}, this.state.hero);
        const freePoints = heroDuck.freePoints;
        const attributes = heroDuck.attributes;

        if (freePoints && attributes && key) {
            let attr = this.findItem(attributes, key);

            if (!attr) {
                attributes.forEach((item) => {
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
                heroDuck.vitality = this.findItem(attributes, 'Сила').value + 3;
                heroDuck.evasion = this.findItem(attributes, 'Ловкость').value + 10;
                heroDuck.boldness = this.findItem(attributes, 'Ловкость').value + this.findItem(attributes, 'Интеллект').value;
                heroDuck.freePoints--;
                heroDuck.attributes = attributes;

                this.setState({
                    hero: heroDuck,
                });
            }
        }
    }

    updateHero(heroDuck) {
        this.setState({
            hero: heroDuck,
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