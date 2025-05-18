CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            videoThumbnail TEXT,
            videoUrl TEXT,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


-- Insert statements for services table

INSERT INTO services (
    title,
    description,
    videoThumbnail,
    videoUrl,
    status
) VALUES (
    'How to Partner with a Tanzanian Miner & Invest in Gold—Legally',
    'The Technical Support Agreement (TSA) provides a legal framework that allows foreign investors to partner with Primary Mining License (PML) holders, ensuring compliance with Section 8(3) of the Mining Act, Cap 123 of 2019.
Tanzania''s mining laws are designed to empower local Tanzanians to benefit from their own natural resources while ensuring that responsible investment contributes to sustainable development. The Technical Support Agreement (TSA) provides a legal framework that allows foreign investors to partner with Primary Mining License (PML) holders, ensuring compliance with Section 8(3) of the Mining Act, Cap 123 of 2019.

🚨 Why Does This Law Exist?
The Tanzanian government, through Vision 2030, recognizes that minerals are a lifeline for economic growth and national prosperity. The intention behind mining laws is to:
✔️ Ensure Tanzanians remain the primary beneficiaries of their mineral wealth.
✔️ Promote sustainable mining that minimizes capital loss and environmental damage.
✔️ Encourage partnerships that elevate small-scale miners with better technology, capital, and expertise.

💡 How Can Foreign Investors Participate?
Tanzania''s law does not prevent foreign investment, but it requires structured engagement through Technical Support Agreements (TSAs) with local Primary Mining License (PML) holders. This ensures that:
🔹 Local miners benefit from technical expertise & financial investment.
🔹 Foreign investors gain legal entry into the gold mining sector.
🔹 All operations remain compliant with Tanzanian mining laws.

🎯 What You''ll Learn in This Video:
✅ The step-by-step process to secure and approve a Technical Support Agreement (TSA).
✅ The common mistakes investors and miners make—and how to avoid them!
✅ How to build a legally recognized mining partnership in Tanzania.',
    'https://uniim1.shutterfly.com/render/00-8pMVwBJ4Q2CKMLNotb_uWnoLxRQe9nboCk4U56S5qky0G8LG7gfYg-fQzGwMiUg2rnHjCyIZu59oV2we_kMG9A?cn=THISLIFE&res=medium&ts=1747495457',
    'https://vimeo.com/1085349109/ce95e229a3?share=copy',
    'active'
);

INSERT INTO services (
    title,
    description,
    videoThumbnail,
    videoUrl,
    status
) VALUES (
    '这个合法漏洞让你无需许可证就能投资黄金矿业',
    '坦桑尼亚的采矿法律旨在让本地坦桑尼亚人从本国的自然资源中受益，同时确保负责任的投资促进可持续发展。技术支持协议（TSA）提供了一种合法框架，允许外国投资者与初级采矿许可证（PML）持有者建立合作伙伴关系，并确保符合*《2019年矿业法》第123章第8(3)条*的规定。

🚨 为什么会有这项法律？
坦桑尼亚政府通过愿景 2030（Vision 2030），认识到矿产资源是经济增长和国家繁荣的关键。采矿法律的核心目标包括：
✔️ 确保坦桑尼亚人仍然是其矿产财富的主要受益者。
✔️ 促进可持续采矿，减少资本损失并保护环境。
✔️ 鼓励合作伙伴关系，使小规模矿工获得更好的技术、资金和专业知识。

💡 外国投资者如何参与？
坦桑尼亚的法律并不禁止外国投资，但它要求通过技术支持协议（TSA）与当地初级采矿许可证（PML）持有者建立结构化的合作，以确保：
🔹 本地矿工受益于技术支持和资金投资。
🔹 外国投资者能够合法进入黄金采矿行业。
🔹 所有运营符合坦桑尼亚采矿法规的要求。

🎯 本视频将为您揭示：
✅ 获取和批准技术支持协议（TSA）的逐步流程。
✅ 投资者和矿工常犯的错误以及如何避免。
✅ 如何在坦桑尼亚建立合法认可的采矿合作伙伴关系。',
    'https://uniim1.shutterfly.com/render/00-8pMVwBJ4Q2CKMLNotb_uWnoLxRQe9nboCk4U56S5qkz05got4Q6Cb6KMvornOjvjVZV51t4MhjbEwRNyGscOgg?cn=THISLIFE&res=medium&ts=1747495470',
    'https://vimeo.com/1085349960/db96a2a954?share=copy',
    'active'
);

INSERT INTO services (
    title,
    description,
    videoThumbnail,
    videoUrl,
    status
) VALUES (
    'Mkataba kati ya Mchimbaji Mdogo na Mwekezaji',
    'Sheria za madini za Tanzania zinalenga kuwawezesha wachimbaji wadogo wa Kitanzania kunufaika na rasilimali zao za asili, huku zikiwawezesha kushirikiana na wawekezaji kwa njia salama na halali. Makubaliano ya Msaada wa Kiufundi (TSA) ni mfumo wa kisheria unaoruhusu mchimbaji mwenye leseni ndogo ya uchimbaji kushirikiana na mwekezaji wa kiufundi kwa ajili ya mtaji, teknolojia, na vifaa vya uchimbaji. Makubaliano haya yanapaswa kuidhinishwa na Tume ya Madini kama inavyotakiwa na Kifungu cha 8(3) cha Sheria ya Madini, Sura ya 123 ya mwaka 2019.
🚨 Kwa Nini Sheria Inalinda Wachimbaji Wadogo?
Serikali ya Tanzania kupitia Vision 2030 inatambua kuwa sekta ya madini ni nguzo ya uchumi na maendeleo ya wananchi. Sheria za madini zinalenga:
✔️ Kuwahakikishia wachimbaji wadogo wanabaki wanufaika wakuu wa madini yao.
✔️ Kuhakikisha uchimbaji unafanywa kisayansi ili kuepuka hasara na uharibifu wa mazingira.
✔️ Kuwasaidia wachimbaji wadogo kushirikiana na wawekezaji kwa njia halali, salama na yenye manufaa.
💡 Jinsi ya Kupata Mwekezaji Kisheria
Sheria haimzuii mwekezaji kuwekeza kwenye mgodi wako, lakini inataka ushirikiano huo uwe rasmi kupitia Makubaliano ya Msaada wa Kiufundi (TSA). Hii inahakikisha:
🔹 Wewe kama mchimbaji unanufaika na mtaji, vifaa vya kisasa na ujuzi wa kiufundi.
🔹 Mwekezaji anashirikiana nawe kwa njia ya halali na salama.
🔹 Uchimbaji wako unafuata sheria na hauna hatari ya kufungwa na mamlaka.
🎯 Katika Video Hii Utajifunza:
✅ Hatua kwa hatua jinsi ya kuhalalisha ushirikiano wenu.
✅ Makosa yanayofanywa na wachimbaji wengi na jinsi ya kuyaepuka.
✅ Mchakato mzima wa kuidhinisha makubaliano yako na Tume ya Madini.',
    'https://uniim1.shutterfly.com/render/00-8pMVwBJ4Q2CKMLNotb_uWnoLxRQe9nboCk4U56S5qkwMzMacFjgFPLmCStCzs-sJqCe7ffHDJpwno-pEcjtJnw?cn=THISLIFE&res=medium&ts=1747495475',
    'https://vimeo.com/1085420411/b9f77191c8?share=copy',
    'active'
);

INSERT INTO services (
    title,
    description,
    videoThumbnail,
    videoUrl,
    status
) VALUES (
    'Usiache Migogoro — Andika Wosia, Linda Urithi',
    'Umeweka juhudi kubwa kujenga mali zako—usiache urithi wako uingie kwenye migogoro. Kupitia huduma hii ya kisheria, tunakuwezesha kuandika wosia wako haraka, salama na kwa mwongozo wa wakili mwenye uzoefu katika masuala ya mirathi.

Hatuuzi tu huduma; tunakupa amani ya akili. Wosia wako utaonyesha kwa uwazi jinsi unavyotaka mali zako zigawanywe na nani anayestahili kusimamia mchakato huo. Kwa kushirikiana na mawakili wetu waliobobea, utahakikisha kuwa sauti yako inaendelea hata baada ya maisha.

Hii ni huduma ya kweli, kwa watu halisi, kwa uangalifu na uaminifu wa hali ya juu.',
    'https://uniim1.shutterfly.com/render/00-8pMVwBJ4Q2CKMLNotb_uWnoLxRQe9nboCk4U56S5qkzRHXNYeHwnc7CnNTbMniRXV7ntXQOewWgszVPDOQPWWw?cn=THISLIFE&res=medium&ts=1747496108',
    'https://vimeo.com/1085423541/0dad138855?share=copy',
    'active'
);

INSERT INTO services (
    title,
    description,
    videoThumbnail,
    videoUrl,
    status
) VALUES (
    'Badilisha Jina Kisheria — Kwa Deed Poll / Kiapo cha Majina',
    'Mabadiliko ya jina ni hatua nyeti inayohitaji ufuasi wa taratibu sahihi za kisheria ili yakubalike na taasisi zote. Tunakusaidia kuandaa Deed Poll rasmi, kuhakikisha usajili wake serikalini, na kuchapishwa katika Gazeti la Serikali kama sheria inavyotaka.

Pia tunakuandalia barua rasmi kwa NIDA, ili jina lako lipitishwe kikamilifu katika kumbukumbu zao. Huduma hii pia inasaidia kwa wateja wanaohitaji kurekebisha majina yaliyokosewa kwenye NIDA au NSSF, ili waweze kupata mafao yao kwa jina sahihi na linalotambulika.

Tunafanya kazi kwa ushirikiano na mawakili waliothibitishwa ili kuhakikisha kila hatua ya mchakato inakuwa halali, salama, na inatekelezwa kwa usahihi.',
    'https://uniim1.shutterfly.com/render/00-8pMVwBJ4Q2CKMLNotb_uWnoLxRQe9nboCk4U56S5qkwBwU03SLrV5Srs7IRJ8ldkqCe7ffHDJpwno-pEcjtJnw?cn=THISLIFE&res=medium&ts=1747495484',
    'https://vimeo.com/1085352206/647570aecb?share=copy',
    'active'
);
