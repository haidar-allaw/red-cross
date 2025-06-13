import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// import Mission from '../components/about/mission';
import './aboutpage.css';


const TABS = [
    { key: 'mission', label: 'Who We Are' },
    { key: 'operations', label: 'What We Do' },
    { key: 'partners', label: 'Our Supporters' },
    { key: 'faq', label: 'Questions' },
];

export default function AboutPage() {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'mission';
    const [active, setActive] = useState(initialTab);

    useEffect(() => {
        if (TABS.some(t => t.key === initialTab)) {
            setActive(initialTab);
        }
    }, [initialTab]);

    return (
        <section className="about-page">
            {/* Tabs */}
            <nav className="about-tabs">
                {TABS.map(tab => (
                    <Link
                        key={tab.key}
                        to={`/about?tab=${tab.key}`}
                        className={`tab-item ${active === tab.key ? 'active' : ''}`}
                        onClick={() => setActive(tab.key)}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>

            {/* Content */}
            <div className="about-content-wrapper">
                {active === 'mission' && (
                    <div className="tab-content">
                        {<h2>About the Lebanese Red Cross</h2>}
                        <div className="about-underline" />
                        <p>
                            The Lebanese Red Cross (LRC), founded in 1945, is an independent, volunteer-driven humanitarian organization committed to providing vital emergency and health services across Lebanon. Guided by the Fundamental Principles of the International Red Cross and Red Crescent Movement—humanity, impartiality, neutrality, independence, voluntary service, unity, and universality—the LRC works tirelessly to prevent and alleviate human suffering.
                        </p>
                        <p>
                            Today, the LRC operates the largest pre-hospital emergency medical service in the country, responding to tens of thousands of calls each year with a fleet of ambulances and highly trained paramedics. In addition to its emergency response role, the LRC oversees the nation’s centralized blood transfusion service, ensuring safe and timely blood products for hospitals and clinics throughout Lebanon.
                        </p>
                        <p>
                            Backed by a dedicated network of over 5,000 volunteers and 1,200 staff, the Lebanese Red Cross also engages in community health education, disaster preparedness, search and rescue operations, and psychosocial support. Through collaboration with local communities, governmental authorities, and international partners, the LRC remains a beacon of solidarity and hope for all people in Lebanon.
                        </p>

                    </div>
                )}
                {active === 'operations' && (
                    <div className="tab-content">
                        <h2>How We Work</h2>
                        <div className="about-underline" />
                        <p>
                            The Lebanese Red Cross runs the country’s largest pre-hospital emergency service, operating a fleet of over 200 ambulances and rapid-response vehicles. Our 1,200 trained paramedics and EMTs answer more than 60,000 calls annually, providing free medical transport, on-site care, and disaster response whenever—and wherever—it’s needed.
                        </p>
                        <p>
                            We also manage the national blood transfusion system, with 12 regional blood banks and mobile donation drives that collect, type, screen, and store thousands of units of blood each month. Our laboratories ensure every donation meets the highest safety standards before distribution to hospitals across Lebanon, maintaining a reliable supply for surgeries, trauma care, and chronic treatments.
                        </p>
                        <p>
                            Beyond emergencies and blood services, the LRC delivers community programs in first-aid training, disaster preparedness workshops, and psychosocial support for vulnerable populations. Our search-and-rescue teams deploy to flood zones, fire incidents, and conflict-affected areas, while our volunteers educate schools and workplaces on safety and resilience, embodying the spirit of solidarity in every corner of Lebanon.
                        </p>
                    </div>
                )}
                {active === 'partners' && (
                    <div className="tab-content">
                        <h2>Our Supporters</h2>
                        <div className="about-underline" />
                        <p>
                            The Lebanese Red Cross is honored to collaborate with a diverse network of partners and supporters. Local NGOs like Amel Association and Arcenciel work alongside us to deliver community health programs and disaster relief across Lebanon.
                        </p>
                        <p>
                            We also partner with international agencies, including the International Committee of the Red Cross (ICRC) and Médecins Sans Frontières (MSF), whose expertise and resources strengthen our emergency response and medical services.
                        </p>
                        <p>
                            Corporate sponsors such as ABC Bank, PharmaCare, and TransLogistics contribute through funding, in-kind donations, and employee volunteer initiatives, enabling us to maintain our ambulance fleet, blood banks, and training programs.
                        </p>
                        <p>
                            Above all, we are grateful to our 5,000+ volunteers and countless individual donors whose generosity and solidarity sustain our mission every day.
                        </p>
                    </div>
                )}
                {active === 'faq' && (
                    <div className="tab-content">
                        <h2>Questions</h2>
                        <div className="about-underline" />
                        <p>
                            <strong>Who can donate blood?</strong><br />
                            Any healthy individual aged 18–60, weighing at least 50kg, with no chronic illnesses or recent infections. First-time donors and repeat donors alike are welcome.
                        </p>
                        <p>
                            <strong>How often can I donate?</strong><br />
                            You can donate whole blood every 12 weeks for men and every 16 weeks for women. Platelet donations may be given more frequently under medical guidance.
                        </p>
                        <p>
                            <strong>Is the donation process safe?</strong><br />
                            Yes. All equipment is sterile and single-use. Our trained staff monitor donors throughout and follow strict hygiene protocols to ensure your safety.
                        </p>
                        <p>
                            <strong>What should I do before donating?</strong><br />
                            Eat a healthy meal, stay hydrated, and avoid heavy exercise on donation day. Bring a valid ID and your donor card (if you have one).
                        </p>
                        <p>
                            <strong>Where will my donation go?</strong><br />
                            Your blood is tested, separated into components, and supplied to hospitals in need—supporting surgeries, trauma care, and patients with chronic conditions.
                        </p>
                    </div>
                )}
            </div>
        </section >
    );
}
