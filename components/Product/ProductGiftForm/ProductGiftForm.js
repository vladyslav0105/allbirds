import { useState } from 'react'
import { useCart } from '@nacelle/react-hooks'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import { getSelectedVariant } from 'utils/getSelectedVariant'
import { getCartVariant } from 'utils/getCartVariant'

import classes from './ProductGiftForm.module.scss'

const defaultFormFields = {
    recipient_name: '',
    recipient_email: '',
    gift_message: ''
}

const ProductGiftForm = (props) => {
    const { addItemToOrder } = useHeadlessCheckoutContext()
    const { checked, handle, product, selectedVariant, setSelectedVariant } = props
    const [formFields, setFormFields] = useState(defaultFormFields)

    const [, { addToCart }] = useCart()
    const [selectedOptions, setSelectedOptions] = useState(
      selectedVariant.content?.selectedOptions
    )
    const [quantity, setQuantity] = useState(1)
    const { recipient_name, recipient_email, gift_message } = formFields

    let options = null
    if (product?.content?.options?.some((option) => option.values.length > 1)) {
      options = product?.content?.options
    }

    const handleGiftInfo = (event) => {
        const {name, value} = event.target
        setFormFields({...formFields, [name]:value })
    }

    const buttonText = selectedVariant
    ? selectedVariant.availableForSale
      ? 'Add To Cart'
      : 'Sold Out'
    : 'Select Option'

    console.log("selectedvariant", selectedVariant)

    const handleOptionChange = (event, option) => {
        const newOption = { name: option.name, value: event.target.value }
        const optionIndex = selectedOptions.findIndex((selectedOption) => {
          return selectedOption.name === newOption.name
        })

        const newSelectedOptions = [...selectedOptions]
        if (optionIndex > -1) {
          newSelectedOptions.splice(optionIndex, 1, newOption)
          setSelectedOptions([...newSelectedOptions])
        } else {
          setSelectedOptions([...newSelectedOptions, newOption])
        }
        const variant = getSelectedVariant({
          product,
          options: newSelectedOptions
        })
        setSelectedVariant(variant ? { ...variant } : null)
    }

    const handleQuantityChange = (event) => {
        setQuantity(+event.target.value)
    }

    const handleAddItem = (event) => {
        event.preventDefault()

        const variant = getCartVariant({
            product,
            variant: selectedVariant
        })

        console.log("product:", product)

        const formFieldsWithGiftOption = {
            ...formFields,
            is_gift_order: checked.toString()
        }

        if (product.tags.includes('Subscription Box')) {
            // add some logic here to determine if regular or prepaid
            formFieldsWithGiftOption.membership_type = 'regular'
        }

        addItemToOrder({
            variant,
            quantity,
            properties: formFieldsWithGiftOption
        })

        setFormFields(defaultFormFields)
    }

    return (
        <form onSubmit={(event) => handleAddItem(event)} className={classes['gift__info']}>
            <div className={classes['quantity']}>
                <label htmlFor={`quantity-${product.nacelleEntryId}`}>
                    Quantity:
                </label>
                <input
                    id={`quantity-${product.nacelleEntryId}`}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                />
            </div>

            {handle === 'digital-gift-card' && <div className={classes['gift-card']}>
                <div className={classes['gift-card__amount']}>
                    <h4 className="heading__pdp-label"><span className={classes['number']}>1</span>Amount</h4>
                </div>

                <div className={classes['gift-card__buttons']}>
                    {/* VARIANT OPTIONS */}
                    {options &&
                        options.map((option) => (
                            option.values.map((value, vIndex) => (
                            <div key={vIndex} className={classes['btn']}>
                                <input type="radio" id={value} name="giftCardButtons" onChange={($event) => handleOptionChange($event, option)} value={value} />
                                <label className="h5" htmlFor={value}>${value}</label>
                            </div>))
                        ))
                    }
                </div>
            </div>}

            {checked && <div className={classes['gift__info-header']}>
                <h4 className="heading__pdp-label">
                {handle === 'digital-gift-card' && <span className={classes['number']}>2</span>}
                {"Recipient's"} Information
                </h4>
                <span className={`delivery--time ${classes['delivery']}`}>Delivered via email one day after purchase.</span>
            </div>}


            {checked && <div className={classes['form__inner']}>
                <div className={classes['form__col']}>
                    <label className="secondary--body" htmlFor="email">Email Address</label>
                    <input placeholder='recipient@email.com' type="email" id="email" name="recipient_email" className="secondary--body" onChange={handleGiftInfo} value={recipient_email} required />
                </div>
                <div className={classes['form__col']}>
                    <label className="secondary--body" htmlFor="name">{"Recipient's"} Name</label>
                    <input placeholder='Recipient Name' type="text" id="name" name="recipient_name" className="secondary--body" onChange={handleGiftInfo} value={recipient_name} required />
                </div>
                {handle === 'digital-gift-card' && <div className={`${classes['form__col']} ${classes['textarea']}`}>
                    <label className="secondary--body" htmlFor="message">Message</label>
                    <textarea placeholder="250 character limit" type="text" id="message" name="gift_message" maxLength="250" className="secondary--body" onChange={handleGiftInfo} value={gift_message} />
                    <p className="disclaimer">*Digital giftcard will be delivered to recipient via email one day after purchase and will include your gift message! </p>
                </div>}
            </div>}

            <button type="submit" disabled={!selectedVariant.availableForSale || selectedVariant.quantity === 0} className="btn salmon">{buttonText}</button>
        </form>
    )
}

export default ProductGiftForm