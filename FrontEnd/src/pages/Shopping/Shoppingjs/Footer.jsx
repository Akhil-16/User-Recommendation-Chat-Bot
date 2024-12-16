import '../Shoppingcss/Footer.css'


const Footer = () => {
    return(
        <div className="footer">
            <div className="border">
            <div>
                <p className="heading">Shopy</p>
            <ul>
                <li>Who we are</li>
                <li>Join our team</li>
                <li>Terms & conditions</li>
                <li>We respect your privacy</li>
            </ul>
            </div>

            <div>
            <p className="heading">Help</p>
            <ul>
                <li>Track tour order</li>
                <li>Returns</li>
                <li>Cancellations</li>
                <li>Payments</li>
            </ul>
            </div>

            <div>
            <p className="heading">Shop by</p>
            <ul>
                <li>Men</li>
                <li>Women</li>
                <li>Kids</li>
                <li>New Arrivals</li>
            </ul>
            </div>

            <div>
            <p className="heading">Follow us</p>
            <ul>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Pinterest</li>
            </ul>

            </div>
            </div>
            <p className="mode">Payment Mode</p>

        </div>
    )

}

export default Footer;