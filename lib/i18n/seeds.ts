import type { HomeServiceItem, ServiceItem } from "./en";

/**
 * Services added after launch. The site content can be saved in the database, and a
 * saved list does not pick up new defaults by itself, so these are added when a
 * language has not been offered the service yet (tracked in `services.seeded`).
 * After that they are ordinary services, edited or deleted in the admin.
 */
export interface ServiceSeed {
  slug: string;
  en: { service: ServiceItem; home: HomeServiceItem };
  ar: { service: ServiceItem; home: HomeServiceItem };
}

export const SERVICE_SEEDS: ServiceSeed[] = [
  {
    slug: "media",
    en: {
      service: {
        icon: "🎬",
        slug: "media",
        title: "Media",
        badge: "Media & Digital Influence",
        intro:
          "Content creation as a platform for the message. We prepare content creators and digital storytellers who carry the message with high professionalism through short films, illustrated curricula and training courses, with an integrated build-up of their spiritual and psychological steadiness.",
        aboutHeading: "Our vision for the sector",
        overview:
          "We believe the digital space and the media are an influential arena and an effective tool for delivering the message. So we build and develop content creators and media workers to become influential leaders who combine technical mastery with spiritual depth.",
        sections: [
          {
            title: "Methodology (Spiritual, Professional, Psychological)",
            desc: "Building content creators on three pillars:",
            points: [
              "Spiritually: Establishing that the word and the image are a trust and a responsibility, so that content carries an authentic spiritual and values-based dimension that shows in every piece a creator makes.",
              "Professionally: Sharpening technical and creative skills in storytelling, directing, filming, editing and digital content preparation to high professional standards.",
              "Psychologically: Supporting inner steadiness and emotional balance to face the pressure of constant publishing, audience feedback and criticism, and the ups and downs of the creative rhythm, without burning out.",
            ],
          },
          {
            title: "Training Programs and Activities",
            desc: "Programs and activities for the sector:",
            points: [
              "Short Film Production: Short, influential visual works that discuss life, work and identity in a creative style that touches reality and reaches wide audiences.",
              "Illustrated Educational Curricula: Developing structured visual learning series that serve spiritual, leadership and personal growth in a simple style that is easy to follow and apply.",
              "Specialized Training Courses: Programs and hands-on workshops that train teams and individuals in content creation, scriptwriting, visual production and managing digital platforms.",
              "Discipleship Groups & Regular Meetings: Spaces to follow up the spiritual and personal growth of media workers, share experience and work as a team in service of the message.",
            ],
          },
        ],
        goal: "To prepare media leaders who combine technical mastery with spiritual depth, and who make the digital space an effective pulpit for the message.",
        tags: ["Short Films", "Illustrated Curricula", "Training Courses", "Discipleship"],
        subServices: [
          {
            slug: "short-films",
            title: "Short Film Production",
            intro:
              "Short, influential visual works that discuss life, work and identity in a creative style that touches reality and reaches wide audiences.",
          },
          {
            slug: "illustrated-curricula",
            title: "Illustrated Educational Curricula",
            intro:
              "Structured visual learning series that serve spiritual, leadership and personal growth in a simple style that is easy to follow and apply.",
          },
          {
            slug: "training-courses",
            title: "Specialized Training Courses",
            intro:
              "Programs and hands-on workshops that train teams and individuals in content creation, scriptwriting, visual production and managing digital platforms.",
          },
          {
            slug: "discipleship-groups",
            title: "Discipleship Groups & Regular Meetings",
            intro:
              "Spaces to follow up the spiritual and personal growth of media workers, share experience and work as a team in service of the message.",
          },
        ],
      },
      home: {
        icon: "🎬",
        title: "Media",
        desc: "We prepare content creators and digital storytellers who carry the message with high professionalism.",
      },
    },
    ar: {
      service: {
        icon: "🎬",
        slug: "media",
        title: "ميديا",
        badge: "الإعلام والتأثير الرقمي",
        intro:
          "صناعة المحتوى كمنبر للرسالة. نُعدّ صُنّاع محتوى ومبدعين رقميين ينشرون الرسالة بمهنية عالية عبر الأفلام القصيرة، المناهج المصورة، والكورسات التدريبية، مع بناء متكامل لثباتهم الروحي والنفسي.",
        aboutHeading: "رؤيتنا للقطاع",
        overview:
          "نؤمن بأن الفضاء الرقمي والميديا ساحة مؤثرة وأداة فعّالة لإيصال الرسالة؛ لذا نعمل على بناء وتطوير صُنّاع المحتوى والعاملين في الإعلام ليكونوا قادة مؤثرين يجمعون بين الإتقان الفني والعمق الروحي.",
        sections: [
          {
            title: "آلية العمل (روحيًا، مهنيًا، نفسيًا)",
            desc: "بناء صُنّاع المحتوى على ثلاث ركائز:",
            points: [
              "روحيًا: ترسيخ مفهوم أن الكلمة والصورة أمانة ومسؤولية؛ ليحمل المحتوى بُعدًا روحيًا وقيميًا أصيلًا ينعكس في كل عمل يقدمه صانع المحتوى.",
              "مهنيًا: صقل المهارات التقنية والإبداعية في السرد القصصي، الإخراج، التصوير، المونتاج، وإعداد المحتوى الرقمي وفق معايير احترافية عالية.",
              "نفسيًا: دعم الثبات الداخلي والاتزان النفسي لمواجهة ضغوط النشر المستمر، التفاعل مع النقد والجمهور، وتقلبات الإيقاع الإبداعي دون استنزاف.",
            ],
          },
          {
            title: "البرامج والأنشطة التدريبية",
            desc: "البرامج والأنشطة التدريبية للقطاع:",
            points: [
              "إنتاج الأفلام القصيرة: إنتاج أعمال مرئية قصيرة ومؤثرة تناقش قضايا الحياة والعمل والهوية بأسلوب إبداعي يلامس الواقع ويصل إلى شرائح واسعة.",
              "المناهج التعليمية المصورة: تطوير سلاسل تعليمية مرئية وممنهجة تخدم النمو الروحي، القيادي، والشخصي بأسلوب مبسط وسهل المتابعة والتطبيق.",
              "كورسات تدريبية متخصصة: برامج وورش عملية لتدريب الفرق والأفراد على مهارات صناعة المحتوى، كتابة السيناريو، الإنتاج المرئي، وإدارة المنصات الرقمية.",
              "مجموعات التلمذة واللقاءات الدورية: مساحات لمتابعة النمو الروحي والشخصي للعاملين في الميديا، وتبادل الخبرات والعمل بروح الفريق في خدمة الرسالة.",
            ],
          },
        ],
        goal: "إعداد قادة في الإعلام يجمعون بين الإتقان الفني والعمق الروحي، ويجعلون من الفضاء الرقمي منبرًا مؤثرًا للرسالة.",
        tags: ["أفلام قصيرة", "مناهج مصورة", "كورسات تدريبية", "التلمذة"],
        subServices: [
          {
            slug: "short-films",
            title: "إنتاج الأفلام القصيرة",
            intro:
              "إنتاج أعمال مرئية قصيرة ومؤثرة تناقش قضايا الحياة والعمل والهوية بأسلوب إبداعي يلامس الواقع ويصل إلى شرائح واسعة.",
          },
          {
            slug: "illustrated-curricula",
            title: "المناهج التعليمية المصورة",
            intro:
              "سلاسل تعليمية مرئية وممنهجة تخدم النمو الروحي، القيادي، والشخصي بأسلوب مبسط وسهل المتابعة والتطبيق.",
          },
          {
            slug: "training-courses",
            title: "كورسات تدريبية متخصصة",
            intro:
              "برامج وورش عملية لتدريب الفرق والأفراد على مهارات صناعة المحتوى، كتابة السيناريو، الإنتاج المرئي، وإدارة المنصات الرقمية.",
          },
          {
            slug: "discipleship-groups",
            title: "مجموعات التلمذة واللقاءات الدورية",
            intro:
              "مساحات لمتابعة النمو الروحي والشخصي للعاملين في الميديا، وتبادل الخبرات والعمل بروح الفريق في خدمة الرسالة.",
          },
        ],
      },
      home: {
        icon: "🎬",
        title: "ميديا",
        desc: "نُعدّ صُنّاع محتوى ومبدعين رقميين ينشرون الرسالة بمهنية عالية عبر الأفلام القصيرة، المناهج المصورة، والكورسات التدريبية.",
      },
    },
  },
];
