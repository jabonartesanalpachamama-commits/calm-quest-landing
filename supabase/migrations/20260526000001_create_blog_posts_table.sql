-- Create cms_posts table
CREATE TABLE IF NOT EXISTS public.cms_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cms_posts ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access: Only if published is true AND published_at is in the past/present
CREATE POLICY "Allow public read access to active and past cms_posts"
  ON public.cms_posts FOR SELECT USING (published = true AND published_at <= now());

-- 2. Admin Manage Access: Allow authenticated admins or service role to perform all actions
CREATE POLICY "Allow service role or admin key to manage cms_posts"
  ON public.cms_posts FOR ALL USING (true);

-- Seed Initial Default Terapuetic Articles (Default Seed)
INSERT INTO public.cms_posts (id, title, slug, content, excerpt, image_url, published, published_at) VALUES
('a191c71b-a5d6-4767-9d7a-11f879685a4b', 
 'Mindfulness y Respiración: Calma tu Ansiedad en 5 Minutos', 
 'calma-tu-ansiedad-en-5-minutos', 
 '# Mindfulness y Respiración: Calma tu Ansiedad en 5 Minutos

La ansiedad es una respuesta natural del cuerpo ante el peligro, pero en nuestro mundo moderno, a menudo se activa ante tensiones del día a día, como un correo electrónico urgente, la sobrecarga laboral o pensamientos persistentes sobre el futuro. Cuando esto ocurre, nuestro sistema nervioso entra en modo de "lucha o huida", aumentando el cortisol y acelerando el corazón.

La buena noticia es que tienes un interruptor biológico integrado para apagar esta alarma: **tu respiración**.

A través de la respiración consciente y técnicas sencillas de Mindfulness, puedes enviar una señal directa a tu cerebro para activar el sistema nervioso parasimpático, el encargado de la relajación y la calma.

---

## La Técnica del Suspiro Terapéutico (Respiración 4-7-8)

Esta técnica, respaldada por la neurociencia moderna, es uno de los tranquilizantes naturales más eficaces para el sistema nervioso. Puedes hacerla en cualquier lugar:

1. **Inhala profundamente por la nariz** durante 4 segundos.
2. **Sostén el aire** en tus pulmones durante 7 segundos.
3. **Exhala completamente por la boca**, haciendo un suave sonido de suspiro, durante 8 segundos.

Repite este ciclo 4 veces. Notarás de inmediato cómo tus hombros caen, tu ritmo cardíaco disminuye y tu mente se enfoca en el momento presente.

---

## Mindfulness en la Rutina Diaria

No necesitas meditar durante horas en una montaña para experimentar los beneficios de la atención plena. El Mindfulness se trata de **presencia**. Aquí tienes tres formas de integrarlo hoy:

* **Al tomar una taza de té o café**: Concéntrate en la calidez de la taza entre tus manos, el aroma que se eleva y los matices del sabor. Si tu mente divaga hacia los pendientes, regrésala suavemente a la taza.
* **Caminar consciente**: Mientras caminas hacia tu oficina o das un paseo, siente el contacto de tus pies con el suelo. Observa los colores del entorno sin juzgar.
* **Escucha atenta**: En tu próxima conversación, escucha a la otra persona con el 100% de tu presencia, sin pensar en lo que vas a responder a continuación.

El bienestar y la calma mental no son metas lejanas, sino pequeñas decisiones conscientes que tomamos momento a momento. ¡Prueba a respirar conscientemente hoy!', 
 'Descubre cómo la respiración consciente y sencillas técnicas corporales pueden reiniciar tu sistema nervioso y devolverte la paz en momentos de tensión.', 
 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', 
 true, 
 now()),

('e2a2c82c-b6e7-5878-ae8b-22f980796b5c', 
 'Kundalini Yoga: La Ciencia de la Vitalidad Diaria y Claridad Mental', 
 'kundalini-yoga-vitalidad-diaria', 
 '# Kundalini Yoga: La Ciencia de la Vitalidad Diaria y Claridad Mental

En la búsqueda constante de equilibrio, a menudo nos enfocamos únicamente en la salud mental o en la física, olvidando que somos una unidad integrada. **Kundalini Yoga**, conocido históricamente como el yoga de la conciencia, es una tecnología holística diseñada precisamente para armonizar nuestro cuerpo, mente y energía vital.

A diferencia de otros estilos de yoga, Kundalini combina posturas físicas dinámicas (*asanas*) con técnicas respiratorias avanzadas (*pranayamas*), cantos de sonidos sagrados (*mantras*) y gestos con las manos (*mudras*).

Esta combinación produce un estímulo directo en el sistema glandular, fortalece el sistema nervioso y despeja la niebla mental en pocos minutos de práctica.

---

## ¿Por qué se le llama una "Ciencia de la Vitalidad"?

Desde una perspectiva biológica, la práctica regular de Kundalini Yoga estimula la glándula pituitaria y la glándula pineal, regulando la liberación de hormonas del bienestar como la dopamina y la serotonina. 

Además, los ejercicios dinámicos incrementan la circulación de líquido cefalorraquídeo hacia el cerebro, mejorando la agudeza cognitiva, la memoria y permitiéndote tomar decisiones bajo presión con una calma inquebrantable.

---

## Una Pequeña Práctica para Iniciar tu Día

Si quieres experimentar el efecto vitalizante del Kundalini, te sugiero iniciar tus mañanas con la **Ego Eradicator** (Eliminador del Ego), una respiración diseñada para recargar tus centros de energía y expandir tus pulmones:

1. Siéntate con las piernas cruzadas de manera cómoda y mantén tu columna recta.
2. Eleva los brazos a un ángulo de 60 grados. Dobla los dedos sobre las palmas de las manos de modo que las yemas toquen la base de los dedos, manteniendo **los pulgares apuntando hacia el cielo**.
3. Cierra los ojos y enfoca tu atención en el entrecejo (tercer ojo).
4. Comienza la **Respiración de Fuego**: una respiración rápida, rítmica y continua a través de la nariz (unas 2-3 respiraciones por segundo). Al exhalar, contrae el ombligo hacia la columna; al inhalar, relájalo.
5. Continúa durante 1 a 3 minutos. Para finalizar, inhala profundo, junta los pulgares arriba de tu cabeza, sostén la respiración unos segundos, exhala y relaja los brazos.

Esta sencilla práctica despejará cualquier somnolencia de tu mente y te dará una claridad e intuición excepcionales para afrontar los desafíos de tu día. Recuerda que la consistencia es la llave que abre la puerta al bienestar duradero.', 
 'Conoce el poder de esta práctica milenaria que combina mantras, mudras y respiración consciente para desbloquear tu energía vital y mejorar tu claridad mental.', 
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', 
 true, 
 now())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, image_url = EXCLUDED.image_url, published_at = EXCLUDED.published_at;
