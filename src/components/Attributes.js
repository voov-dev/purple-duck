import React from "react";

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

export {Attributes};
export {Attribute};