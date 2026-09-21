import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  VisualIdentity, 
  COLOR_PALETTES, 
  getLocalSettings, 
  applyCssVariablesForPalette, 
  applyFontPair 
} from "@/lib/CmsFallbackData";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Settings } from "lucide-react";

const TerminosYCondiciones = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((item) => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as unknown as VisualIdentity;
        }
      } catch { /* fallback to local */ }
      
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  return (
    <div className={`min-h-screen bg-background font-sans text-foreground flex flex-col ${palette.bgLayer}`}>
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow pt-24 pb-16 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Header Section */}
          <section className="text-center space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-medium tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Condiciones del servicio para Terapia psicológica y programas de Yoga online. SantoSha: Bienestar Integral
            </p>
          </section>

          {/* Content Section */}
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-sm border border-border/40 text-muted-foreground space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-primary">Políticas y condiciones aplicables de manera general para todos los servicios</h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre todas las consultas en línea</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>La duración de la sesión es de 1 hora, y solo necesitas conexión a Internet y un dispositivo con audio y vídeo.</li>
                <li>Una vez realizado el pago de tu sesión recibirás, un e-mail con las instrucciones para reservar tu cita.</li>
                <li>La atención es de lunes a viernes de 8:00 am a 6:00 pm | hora Colombia. Con previo acuerdo y disponibilidad, podrán asignarse sesiones los sábados de 8:00 am a 2:00 pm.</li>
                <li>Después de adquirida la cita de psicoterapia, el consultante tendrá 3 meses para hacer uso de la sesión o de su paquete. Si después de este tiempo el comprador no ha tomado su sesión o su paquete, se entenderá que ha desistido de su intención de hacer uso del servicio.</li>
                <li><strong>Ten presente:</strong> Todas las consultas son 100% virtuales a través de sala privada de vídeo conferencia.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Otras consideraciones:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>En caso de acompañamiento a niños y adolescentes se requerirá participación y/o autorización de sus padres o tutores legales.</li>
                <li>Las sesiones de terapia en pareja y terapia familiar son realizadas a través de una sesión virtual grupal y para iniciar terapia de pareja recomendamos fehacientemente que se tomen como mínimo 3 sesiones.</li>
                <li>En la consulta emplearemos técnicas especialmente adaptadas a tus necesidades, combinando la ciencia y la espiritualidad.</li>
                <li>Nuestros procesos son altamente efectivos a través de un proceso de confrontación directa y amorosa.</li>
                <li>Finalizando la primera sesión te llevarás un panorama general de los aspectos a trabajar.</li>
                <li>En la mayoría de los casos, nuestro acompañamiento para un tema específico se realiza entre 3 y 6 sesiones en las cuales recibirás herramientas para la gestión de tu situación. No obstante, cada caso es particular y la duración del tratamiento se definirá bajo el criterio del terapeuta. Para un acompañamiento más completo, te recomendamos iniciar con un paquete de 3 sesiones.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre las consultas en línea:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Muchas personas esperan por el acompañamiento, por esta razón somos muy estrictos con el cumplimiento de la agenda.</li>
                <li>Para no privar a otros de la oportunidad de recibir la asesoría, en caso de no poder asistir, las citas deben cancelarse con 24 (veinticuatro) horas de antelación, de lo contrario no serán reprogramadas.</li>
                <li>Una vez adquirida la cita no se realizarán devoluciones de dinero, si tienes alguna inquietud, no dudes en ponerte en contacto con nosotros antes de realizar la compra: whatsapp +57 3105679517 o correo: fransury.gh@gmail.com</li>
                <li>Dentro de las 24 (veinticuatro) horas hábiles después de realizada la compra, nos pondremos en contacto con el comprador vía correo electrónico para confirmar la compra. Posterior a esto, dentro de las 24 horas siguientes, estaremos coordinando la fecha y hora de las citas. Te recomendamos revisar tu bandeja de correo no deseado, en caso de no recibir la confirmación de tu compra y el mensaje para agendamiento de cita dentro de este tiempo, comunícate inmediatamente con nosotros en el whatsapp +57 3105679517 con el fin de que podamos validar tu transacción.</li>
                <li>Confiamos en la seriedad de las personas que adquieren el servicio, por esto, una vez programada la cita no se emitirán recordatorios, una vez acordada la fecha y hora del encuentro, es responsabilidad del comprador programarse para asistir oportunamente a su consulta teniendo en cuenta las diferencias horarias de cada país.</li>
                <li>Para mayor información ponte en contacto con nosotros, estaremos encantados de atenderte vía whatsapp o correo electrónico.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre las clases de Yoga, talleres y programa formativo en línea:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Son programas en línea que se realizan a través de grupos cerrados y en fechas previamente establecidas, en salas compartidas para los encuentros, es importante que tengas presente que al adquirir una clase, taller o programa formativo estarás aceptando que tu participación se realizará mediante este espacio común.</li>
                <li>Una vez adquirido una clase, taller o el programa formativo en Línea no habrá lugar a devoluciones económicas, en caso de que por motivo de fuerza mayor (demostrable) el comprador no pueda hacer uso del programa adquirido, este podrá ser transferible a otra persona o bien aplazado previa aprobación del equipo SantoSha: Bienestar integral.</li>
                <li>Los programas o talleres tendrán una duración establecida, se dictarán según la fecha de programación que corresponda, las fechas se comunican siempre de manera previa cuando se realice el proceso de inscripción.</li>
                <li>Tienen un tiempo de realización definido, te invito a tener muy presente las fechas establecidas al momento de la inscripción. En caso de no poder asistir en las fechas programadas de manera grupal y solicitar un espacio individual, las prórrogas tendrán un valor de 50 dólares, sin excepción. El tiempo de extensión corresponderá al tiempo inicial del curso. Las prórrogas de tiempo deberán solicitarse antes de 1 mes o de haberse cumplido el tiempo límite del entrenamiento, y la solicitud debe realizarse en el número de whatsapp + 57 3105679517.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre los eventos presenciales y otros servicios:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Es importante que preveas todo lo necesario antes de adquirir tu lugar en un evento presencial, ten presente que por ningún motivo se realizarán devoluciones económicas, entenderás que los eventos presenciales tienen cupos limitados y por tanto nos vemos en la obligación de reservar, contratar y pagar todos los servicios asociados a la realización del evento desde el momento en el que confirmas tu participación.</li>
                <li>En caso de no poder asistir por un motivo de fuerza mayor debidamente demostrable, podrás ceder tu participación a otra persona previa revisión del caso con el equipo encargado por parte de SantoSha: Bienestar integral.</li>
                <li>Al adquirir los productos y servicios de SantoSha: Bienestar integral., el participante, asistente, comprador o consultante declara que acepta y está de acuerdo en que tanto en las sesiones de consulta, asesoría psicológica o acompañamientos realizados por Fransury González o los profesionales de su equipo, así como, los eventos virtuales o presenciales realizados por Fransury González y su equipo, la participación del asistente, consultante o comprador, en dichos espacios es totalmente voluntaria, por lo tanto, exonera de toda responsabilidad legal tanto a Fransury González como a su Centro SantoSha: Bienestar integral y a su equipo (cuando hubiera lugar) por cualquier inconveniente presentado dentro de cualquiera de estos espacios y que pueda afectar su salud, integridad física o la vida. Por lo anterior, todos los gastos que pudieran surgir a raíz de o durante su participación en dicha actividad tales como: Gastos médicos, servicios de urgencias, ambulancias, gastos quirúrgicos o farmacéuticos, cirugías, hospitalización, medicamentos, o cualquier otro gasto que sobrevenga por la ocurrencia de cualquier hecho o acontecimiento con ocasión de su participación en los eventos virtuales, presenciales o las sesiones organizadas por Fransury González y su equipo, correrán exclusivamente por cuenta del asistente, participante, comprador o consultante, y por tanto, no habrá lugar a reclamación alguna a Fransury González o su equipo para que cubran los mismos o reembolsen algún valor, ni habrá lugar a pedir ningún tipo de indemnización de perjuicio moral o material directo o indirecto o cualquier otro tipo de perjuicio que pudiera llegar a causarse con ocasión de la participación en los servicios o eventos de Fransury González. Tampoco habrá lugar a reclamación alguna si sobrevienen daños o pérdidas sobre o en sus bienes durante la participación de los eventos. Solo se presentarán excepciones en aquellos casos en los que de manera explícita se cuente con algún seguro médico o de viaje, y que este seguro haga parte la organización del evento y en cuyo caso, todas las reclamaciones pertinentes deberán realizarse de manera directa con el prestador del seguro y no con SantoSha: Bienestar integral.</li>
                <li>El comprador o participante a través de su registro a los eventos presenciales o virtuales de Fransury González, confirma que autoriza que Fransury González utilice para fines comerciales, promocionales o informativos, el uso de la imagen del comprador o participante a través de las fotografías, videos, testimonios, participaciones visuales, verbales, escritas o en vídeo, tanto si estos son capturados y registrados por el equipo de SantoSha durante los eventos virtuales o presenciales, o tanto si estos son producidos, publicados o divulgados dentro de dichos eventos por los compradores o participantes.</li>
                <li>En los eventos presenciales, SANTOSHA: BIENESTAR INTEGRAL, FRANSURY GONZÁLEZ - PSICÓLOGA, se reserva el derecho a mantener la disciplina y el orden, pudiendo, de ser necesario, retirar a los asistentes que perturben el normal desarrollo del evento y que pongan en riesgo la armonía y el bienestar de los demás participantes.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Derechos de autor:</h3>
              <p>Protección de los derechos de propiedad intelectual de Fransury González.</p>
              <p>No se autoriza la publicación del contenido de este sitio web o del material compartido en los procesos individuales y de formación a menos que el autor explícitamente así lo autorice. Se prohíbe el uso de los derechos de autor, imágenes o marcas de Fransury González, sin su permiso escrito.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre la privacidad de la información</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Al inscribirse en las listas de espera, formularios de comunidad o cualquier otro espacio de registro, así como al crear su usuario en cualquier web del dominio santoshayoga.com.co, inscribirse para participar en sus eventos presenciales y virtuales, solicitar citas de acompañamiento o disfrutar de cualquier contenido en esta web, usted afirma estar suministrando de manera voluntaria y libre sus datos de contacto e identificación personal.</li>
                <li>Es posible que para la participación en cualquiera de los servicios ofrecidos en esta web, le sean solicitados algunos datos personales como su ocupación, lugar de residencia o estado civil, esto se hace con el fin de salvaguardar el interés del titular y favorecer la prestación de los servicios.</li>
                <li>Los datos personales y datos de navegación recogidos automáticamente por este sitio web, son suministrados libremente por el usuario, entre ellos se incluyen: La información de su registro en el sitio, así como la información que usted decida compartir a través de los formularios tal como su nombre, dirección de correo electrónico, número de teléfono fijo móvil.</li>
                <li>Usted autoriza ser contactado a través del número telefónico que suministró o el correo electrónico provisto en el momento de realizar su compra o consulta.</li>
                <li>La información que se suministra dentro del proceso terapéutico a través de cualquier medio (mail, video llamada, chat o presencial) se encuentra protegida por el secreto profesional y será de carácter confidencial, salvo en aquellos casos en los que la ley o el gobierno lo autoricen y/o lo requieran, por esta razón no se realizaran grabaciones de las sesiones de acompañamiento a menos que el participante (paciente/consultante) lo solicite explícitamente, de esta manera, el envío de la información de su sesión (grabación) será suministrado a través de medios virtuales como aplicaciones de mensajería o correos electrónicos y Fransury González no se hará responsable de las filtraciones que puedan desprenderse de dicho proceso.</li>
                <li>Al aceptar esta política, usted autoriza que sus datos básicos de contacto sean empleados para la divulgación de eventos, talleres, seminarios y demás propósitos con fines terapéuticos, de desarrollo humano y crecimiento personal realizados por SantoSha: Bienestar integral, Fransury González - psicóloga.</li>
                <li>El procesamiento de los datos provistos a terceros, tales como los suministrados a los proveedores de Pagos virtuales (Payu, Paypal, PSE, Bold, entre otros) es de total autonomía y manejo de dichas compañías, se le recomienda leer detalladamente sus políticas de tratamiento de datos y procesamiento de información.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Sobre el uso del servicio:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fransury González, no es responsable de las acciones, contenidos, información o datos de terceros, por tanto usted la libera de reclamos o daños, conocidos y desconocidos, que surjan por alguna relación con o reclamo que tenga en contra de cualquier tipo de terceros.</li>
                <li>En ningún caso, el servicio adquirido podrá ser objeto de devolución, cambio, alteración o compensación a petición del comprador. Si el consultante, participante o asistente no desea un servicio que ya fue pago, previa consulta y autorización de Fransury González y equipo asesor se determinará si se puede pasar hacia otra persona.</li>
                <li>En cualquier momento Fransury González en representación de Santosha: Bienestar integral podrá modificar los valores de los servicios ofrecidos.</li>
                <li>Fransury González en representación de Santosha: Bienestar integral se reserva la facultad de modificar el contenido, presentación, configuración y/o los servicios ofrecidos -por sí mismo o mediante un tercero autorizado- sin notificar previamente al usuario.</li>
                <li>Fransury González en representación de Santosha: Bienestar integral no asume responsabilidad alguna por los daños y perjuicios de toda naturaleza que puedan derivarse de la presencia de virus o de la presencia de otros elementos lesivos en los servicios prestados a través de éste sitio web o por sitios web de terceros que puedan producir alteraciones en el sistema informático, documentos electrónicos o archivos del usuario.</li>
                <li>La inclusión de vínculos a otros sitios a través de santoshayoga.com.co no implica ninguna relación diferente al “vínculo” mismo. Todas las transacciones realizadas en dichos vínculos son responsabilidad exclusiva del usuario y de la entidad relacionada.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary/80">Contáctanos</h3>
              <p>Estaremos encantados de asesorarte y acompañarte a elegir el acompañamiento que más se ajuste a tus necesidades, ponte en contacto con nosotros. Responderemos tu mensaje en menos de 24 horas hábiles.</p>
            </div>
            
          </section>
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-foreground">
            {settings?.brandName || "SantoSha"}
          </p>
          <p className="font-light">
            {settings?.footerText || "Bienestar · Conciencia · Transformación"}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link to="/terminos-y-condiciones" className="hover:underline text-xs text-muted-foreground/60 transition-colors">Términos y Condiciones</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors flex items-center gap-1"><Settings className="w-3 h-3" /> Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TerminosYCondiciones;
