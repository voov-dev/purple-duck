import React from 'react';
import ReactDOM from 'react-dom';
import './sass/style.scss';
import imageSrc from './img/PurpleDuck-Sheet.png'

class Duck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHurt: false,
            isJump: false,
            isQuack: false,
        };
    }

    handleChange(duckState) {
        console.log('>> duckState: ', duckState)
        this.setState({
            isHurt: !this.state.isHurt
        });
    }

    render() {
        return (
            <div
                className={
                    `duck 
                    ${this.state.isHurt ? 'duck--hurt' : ''} 
                    ${this.state.isJump ? 'duck--jump' : ''} 
                    ${this.state.isQuack ? 'duck--quack' : ''}`
                }
                onClick={() => this.handleChange()}>
                <div className="duck__sprite-sheet-wrap">
                    <img src={imageSrc} className="duck__sprite-sheet" alt={this.props.name}/>
                </div>
            </div>
        )
    }
}

function Dialog(props) {
    return (
        <div className="dialog">{props.text}</div>
    )
}

class Board extends React.Component {

    render() {
        return (
            <div className="board">
                <div className="board__hero-box">
                    <Duck onClick={() => this.props.onClick()} />
                </div>
                <div className="board__dialog">
                    <Dialog text={'Осуждаю'} />
                </div>
                <div className="board__health">HP 1 / 3</div>
            </div>
        )
    }
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
                        ${props.isActive ? 'attribute__btn-inc--active' : ''}
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hero: {
                name: null,
                freePoints: 5,
                health: 3,
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
        console.log('>> click')

        return {
            isHurt: true
        }
    }

    findItem(arr, key) {
        return arr.find((item) => item.name === key)
    }

    handleClickAttribute(key) {
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

            if (attr) {
                console.log('>> attr: ', HERO_ATTRIBUTES['Ловкость'])
                attr.value += 1;
                this.setState({
                    hero: {
                        vitality: this.findItem(HERO_ATTRIBUTES, 'Сила').value + 3,
                        evasion: this.findItem(HERO_ATTRIBUTES, 'Ловкость').value + 10,
                        boldness: this.findItem(HERO_ATTRIBUTES, 'Ловкость').value + this.findItem(HERO_ATTRIBUTES, 'Интеллект').value,
                        freePoints: FREE_POINTS - 1,
                        attributes: HERO_ATTRIBUTES,
                    }
                })
            }
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game__col">
                    <Board onClick={() => this.handleClick()} />
                    <div className="game__custom-input custom-input">
                        <label htmlFor="user-name" className="custom-input__field-wrap">
                            <input type="text" className="custom-input__field" placeholder={'Имя'}/>
                            <span className="custom-input__name">Имя</span>
                        </label>
                    </div>
                    <button className="custom-button">Сохранить</button>
                    <button className="custom-button">Загрузить</button>
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