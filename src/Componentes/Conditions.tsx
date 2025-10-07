import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Section {
  title: string;
  id: string;
  content: string;
}

const Conditions: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('relacion');

  const sections: Section[] = [
    {
      title: 'Su Relación con Nosotros',
      id: 'relacion',
      content: `Bienvenido a TikTok (la “Plataforma”), que es proporcionada por TikTok Pte. Ltd. o una de sus afiliadas (“TikTok” o “nosotros”).

Usted está leyendo los términos de servicio (los “Términos”), que rigen la relación y que constituyen un acuerdo entre usted y nosotros, así como también el uso de nuestros servicios, incluyendo nuestros sitios web, aplicaciones (incluida la aplicación de TikTok) y otros servicios (colectivamente, los “Servicios”). Nuestros Servicios son prestados para efectos de uso personal y no comercial. Para fines de estos Términos, “usted” significa usted como usuario de los Servicios.

Los Términos constituyen un acuerdo legalmente vinculante entre usted y nosotros. Por favor, tómese el tiempo para leerlos cuidadosamente.`
    },
    {
      title: 'Aceptación de los Términos',
      id: 'aceptacion',
      content: `Al acceder o utilizar nuestros Servicios, confirma que puede celebrar un contrato vinculante con TikTok, que acepta estos Términos y que acuerda cumplirlos.

Su acceso y uso de nuestros Servicios también está sujeto a nuestra Política de Privacidad y a los Normas de la comunidad, cuyos términos pueden encontrarse directamente en la Plataforma, o donde la Plataforma se encuentra disponible para su descarga.

Al utilizar los Servicios, otorga su consentimiento a los términos de la Política de Privacidad.`
    },
    {
      title: 'Indemnización',
      id: 'indemnizacion',
      content: `Usted indemnizará y mantendrá indemne y libre de responsabilidad a TikTok, a sus matrices, subsidiarias y afiliadas y a sus respectivos funcionarios, consejeros, empleados, agentes, socios y licenciantes de cualquier reclamación o demanda, incluidos honorarios razonables de abogados, que surjan de su uso de los Servicios, su violación de estos Términos, o su violación de cualquier derecho de terceros.

TikTok se reserva el derecho, a su cargo, de asumir la defensa y el control exclusivos de cualquier asunto que de otro modo esté sujeto a indemnización por su parte, y en ese caso, usted acepta cooperar con la defensa de TikTok de dicha reclamación.

Esta obligación de indemnización sobrevivirá a la terminación de estos Términos y al uso por su parte de los Servicios.`
    },
    {
      title: 'Otros Términos',
      id: 'otros',
      content: `Estos Términos constituyen el acuerdo completo entre usted y TikTok respecto al uso de los Servicios.

Si alguna disposición de estos Términos se considera inválida o inaplicable, dicha disposición se eliminará y las disposiciones restantes permanecerán en pleno vigor y efecto.

Cualquier falla de TikTok para hacer cumplir cualquier derecho o disposición de estos Términos no constituirá una renuncia a dicho derecho o disposición.`
    }
  ];

  const scrollToSection = (id: string): void => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
  <div
    className="container-fluid px-4 py-5 text-white"
    style={{ backgroundColor: '#121212' }}
  >

      <div className="row">
        {/* Sidebar fijo con Bootstrap */}
        <aside className="col-md-3 border-end border-dark sticky-top vh-100 overflow-auto pt-3">
          <ul className="list-group list-group-flush small">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className={`list-group-item bg-transparent border-0 px-0 py-1 list-group-item-action ${
                  activeId === section.id ? 'text-danger fw-bold' : 'text-white'
                }`}
                style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => scrollToSection(section.id)}
              >
                {index + 1}. {section.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenido legal */}
        <main className="col-md-9">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mb-5">
              <h2 className="h6 text-white mb-3">
                {index + 1}. {section.title}
              </h2>
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-light small mb-3">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Conditions;