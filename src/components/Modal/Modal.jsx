import React from 'react'
import styles from './modal.module.scss'
import { Button, Divider } from '@nextui-org/react'
import { Slider } from "@nextui-org/react";


const Modal = ({ isOpen, onOpen, onClose, setBlowSensibility, blowSensibility }) => {
    return (
        <div
            className={`${styles.modalContainer} ${!isOpen && styles.isOpen}`}
        >
            <Button isIconOnly size='md' className={styles.closeButton} onClick={() => onClose()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={60}
                    height={60}
                    viewBox="0 0 24 24"
                    style={{ fill: "#ffffff", transform: "", msfilter: "" }}
                >
                    <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z" />
                </svg>

            </Button>

            <div className={styles.wrapper}>
                <h2>Ajustes</h2>
                <Divider className="my-4" />
                <Slider
                    // className={styles.slider}
                    label="Select a value"
                    showTooltip={true}
                    step={0.1}
                    formatOptions={{ style: "percent" }}
                    maxValue={1}
                    minValue={0.1}
                    marks={[
                        {
                            value: 0.2,
                            label: "20%",
                        },
                        {
                            value: 0.5,
                            label: "50%",
                        },
                        {
                            value: 0.8,
                            label: "80%",
                        },
                    ]}
                    onChange={(e) => { setBlowSensibility(e) }}
                    defaultValue={blowSensibility}
                // className="max-w-xl"
                />
            </div>

        </div>
    )
}

export default Modal