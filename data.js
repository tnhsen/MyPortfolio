export const PROFILE = {
  name: "ธานี ธงภักดิ์",
  role: "Full Stack Web Developer",
  greeting: "Hello! I'm",
  description:
    "นักศึกษาปี 3 สาขาเทคโนโลยีดิจิทัล ที่ผสมผสาน วิทยาศาสตร์ ทางเทคนิคเข้ากับ ศิลปะ เชิงสร้างสรรค์ มีทักษะทั้งด้าน Frontend และ Backend พร้อมเรียนรู้เทคโนโลยีใหม่ๆ เสมอ",
  image: require("./assets/profile.jpg"),
  resume_url: require("./assets/resume.pdf"),
};

export const SKILL_GROUPS = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "HTML", icon: "language-html5" },
      { name: "JS", icon: "language-javascript" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: ".NET FRAMEWORK", icon: "dot-net" },
      { name: "SQL", icon: "database" },
      { name: "Python", icon: "language-python" },
      { name: "Java", icon: "language-java" },
    ],
  },
];

export const SOFT_SKILLS = [
  {
    id: "1",
    title: "Adaptability",
    icon: "sync",
    desc: "เรียนรู้ไว ปรับตัวเข้ากับเทคโนโลยีใหม่ได้เสมอ",
  },
  {
    id: "2",
    title: "Teamwork",
    icon: "account-group-outline",
    desc: "ทำงานร่วมกับทีมได้อย่างราบรื่น",
  },
  {
    id: "3",
    title: "Lifelong Learning",
    icon: "book-open-variant",
    desc: "พัฒนาตนเองอย่างต่อเนื่อง",
  },
  {
    id: "4",
    title: "Problem Solving",
    icon: "puzzle",
    desc: "คิดวิเคราะห์หาสาเหตุและวิธีแก้ปัญหาที่ซับซ้อน",
  },
];

export const PROJECTS = [
  {
    id: "1",
    title: "SkillEx Platform",
    stack: ".NET Framework",
    images: [
      require("./assets/skillEx/p1.png"), 
      require("./assets/skillEx/p2.png"),
      require("./assets/skillEx/p3.png"),
    ],
    desc: "แพลตฟอร์มแลกเปลี่ยนทักษะออนไลน์ โดยใช้ AI ช่วยในการจับคู่ มีระบบการรีวิวหลังจากแลกเปลี่ยนเพื่อเพิ่มเครดิตให้ผู้ใช้อื่น",
    technologies: [".NET Framework", "C#", "LocalSQL", "Javascript"],
    role: "Backend Developer",
    learnings: ["การนำ AI เข้ามาใช้ในโปรเจค", "การสร้างออกแบบ Database ที่ซับซ้อน"],
    link: "https://github.com/tnhsen/SkillEx.git",
    isDeployed: false,
    visitLink: "",
  },
  {
    id: "2",
    title: "Splitit",
    stack: "Flask",
    images: [
      require("./assets/splitit/p1.png"), 
      require("./assets/splitit/p2.png"),
    ],
    desc: "ระบบหารค่าใช้จ่ายกับกลุ่มเพื่อนที่มีการคำนวณที่ซับซ้อน เช่น เมื่อมีการสำรองจ่ายก่อนมากกว่า 1 คน, เมื่อแต่ละคนสำรองจ่ายไม่เท่ากัน",
    technologies: ["Python", "MangoDb Atlas"],
    role: "Project Manager",
    learnings: ["การใช้ Python เขียนเว็ป", "การใช้ MangoDb Atlas"],
    link: "https://github.com/tnhsen/Splitit.git",
    isDeployed: true,
    visitLink: "https://splitit-1ept.onrender.com/",
  },
  {
    id: "3",
    title: "DekwebInternships",
    stack: "HTML",
    images: [
      require("./assets/dekwebITS/p1.png"), 
    ],
    desc: "static web แสดงความยินดีให้กับเพื่อนๆในกลุ่ม",
    technologies: ["HTML", "CSS", "Java script"],
    role: "Project Manager",
    learnings: ["การทำ Animation บนเว็ป"],
    link: "https://github.com/tnhsen/DekwebInternships.git",
    isDeployed: true,
    visitLink: "https://tnhsen.github.io/DekwebInternships/",
  },
  {
    id: "4",
    title: "Huay Bong Wind Turbine",
    stack: "HTML",
    images: [
      require("./assets/huaybong/hb1.png"), 
      require("./assets/huaybong/hb2.png"), 
      require("./assets/huaybong/hb3.png"), 
      require("./assets/huaybong/hb4.png"), 

    ],
    desc: "เว็ปบล็อคแสดงข้อมูลกังหันลมห้วยบง",
    technologies: ["HTML", "CSS", "Java script"],
    role: "Project Manager",
    learnings: ["การทำเว็ปบล็อคพร้อมเรียนรู้ลูกเล่นอย่าง parallax"],
    link: "https://github.com/tnhsen/HuaiBongWindTurbine.git",
    isDeployed: true,
    visitLink: "https://tnhsen.github.io/HuaiBongWindTurbine/",
  },
 
];
