// Sample preview content for each book
const bookPreviews = {
    // English content
    'power-of-prayer': {
      title: 'The Power of Prayer',
      pages: [
        'Chapter 1: Understanding Prayer\n\nPrayer is the most powerful spiritual force available to humankind. It is a direct connection to God, a channel through which we can express our deepest thoughts, fears, and aspirations...',
        'Prayer is not just about asking for things; it\'s about building a relationship with God. Through prayer, we learn to listen to His voice and understand His will for our lives...',
        'When we pray, we acknowledge our dependence on God and our trust in His wisdom. Prayer helps us align our will with God\'s will...',
        'Regular prayer practice strengthens our faith and helps us maintain a constant connection with our Creator. It provides comfort in times of trouble...',
        'As we develop our prayer life, we begin to see transformative changes in our spiritual journey. Prayer becomes not just an activity, but a way of life...'
      ]
    },
    'walking-in-faith': {
      title: 'Walking in Faith',
      pages: [
        'Chapter 1: The Journey Begins\n\nFaith is not just a destination; it\'s a journey. Every step we take in faith brings us closer to understanding God\'s purpose for our lives...',
        'Walking in faith means trusting God even when the path ahead seems unclear. It\'s about believing in His promises and holding onto hope...',
        'Our faith journey is unique to each of us, yet we all share the common goal of drawing closer to God. Through faith, we find strength...',
        'Faith is tested through trials, but these challenges serve to strengthen our resolve and deepen our trust in God...',
        'As we continue our walk of faith, we discover that God is faithful in all circumstances. His love guides us through every season...'
      ]
    },
    'daily-devotionals': {
      title: 'Daily Devotionals',
      pages: [
        'January 1: New Beginnings\n\nScripture: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!" - 2 Corinthians 5:17...',
        'January 2: God\'s Promises\n\nScripture: "For no matter how many promises God has made, they are \'Yes\' in Christ." - 2 Corinthians 1:20...',
        'January 3: Walking in Love\n\nScripture: "And walk in love, as Christ loved us and gave himself up for us." - Ephesians 5:2...',
        'January 4: The Power of Prayer\n\nScripture: "Do not be anxious about anything, but in every situation, by prayer and petition..." - Philippians 4:6...',
        'January 5: Living by Faith\n\nScripture: "For we live by faith, not by sight." - 2 Corinthians 5:7...'
      ]
    },
    // Telugu content
    'ప్రార్థన-శక్తి': {
      title: 'ప్రార్థన శక్తి',
      pages: [
        'అధ్యాయం 1: ప్రార్థనను అర్థం చేసుకోవడం\n\nప్రార్థన మానవజాతికి అందుబాటులో ఉన్న అత్యంత శక్తివంతమైన ఆధ్యాత్మిక శక్తి. ఇది దేవునితో ప్రత్యక్ష సంబంధం, దీని ద్వారా మనం మన లోతైన ఆలోచనలు, భయాలు మరియు ఆకాంక్షలను వ్యక్తపరచవచ్చు...',
        'ప్రార్థన కేవలం వస్తువులను అడగడం గురించి కాదు; ఇది దేవునితో సంబంధాన్ని నిర్మించుకోవడం గురించి. ప్రార్థన ద్వారా, మనం ఆయన స్వరాన్ని వినడం మరియు మన జీవితాల కోసం ఆయన చిత్తాన్ని అర్థం చేసుకోవడం నేర్చుకుంటాము...',
        'మనం ప్రార్థించినప్పుడు, దేవునిపై మన ఆధారపడటాన్ని మరియు ఆయన జ్ఞానంపై మన నమ్మకాన్ని గుర్తిస్తాము. ప్రార్థన మన ఇష్టాన్ని దేవుని చిత్తంతో సమలేఖనం చేయడంలో సహాయపడుతుంది...',
        'క్రమబద్ధమైన ప్రార్థన అభ్యాసం మన విశ్వాసాన్ని బలపరుస్తుంది మరియు మన సృష్టికర్తతో నిరంతర సంబంధాన్ని కొనసాగించడంలో సహాయపడుతుంది. ఇది కష్ట సమయాల్లో ఓదార్పునిస్తుంది...',
        'మనం మన ప్రార్థనా జీవితాన్ని అభివృద్ధి చేసుకున్నప్పుడు, మన ఆధ్యాత్మిక ప్రయాణంలో పరివర్తనాత్మక మార్పులను చూడటం ప్రారంభిస్తాము. ప్రార్థన కేవలం ఒక కార్యకలాపం కాదు, ఒక జీవన విధానం అవుతుంది...'
      ]
    },
    'విశ్వాసంలో-నడుస్తూ': {
      title: 'విశ్వాసంలో నడుస్తూ',
      pages: [
        'అధ్యాయం 1: ప్రయాణం ప్రారంభం\n\nవిశ్వాసం కేవలం గమ్యం కాదు; ఇది ఒక ప్రయాణం. విశ్వాసంలో మనం వేసే ప్రతి అడుగు మన జీవితాల కోసం దేవుని ఉద్దేశ్యాన్ని అర్థం చేసుకోవడానికి దగ్గరగా తీసుకువెళుతుంది...',
        'విశ్వాసంలో నడవడం అంటే ముందున్న మార్గం అస్పష్టంగా ఉన్నప్పటికీ దేవునిపై నమ్మకం ఉంచడం. ఇది ఆయన వాగ్దానాలను నమ్మడం మరియు ఆశను పట్టుకోవడం గురించి...',
        'మన విశ్వాస ప్రయాణం మనలో ప్రతి ఒక్కరికీ ప్రత్యేకమైనది, అయినప్పటికీ మనమందరం దేవునికి దగ్గరగా రావడం అనే సామాన్య లక్ష్యాన్ని పంచుకుంటాము. విశ్వాసం ద్వారా, మనం శక్తిని కనుగొంటాము...',
        'విశ్వాసం పరీక్షల ద్వారా పరీక్షించబడుతుంది, కానీ ఈ సవాళ్లు మన సంకల్పాన్ని బలోపేతం చేయడానికి మరియు దేవునిపై మన నమ్మకాన్ని లోతు చేయడానికి ఉపయోగపడతాయి...',
        'మనం విశ్వాసంలో నడుస్తూ ఉండగా, దేవుడు అన్ని పరిస్థితులలో నమ్మదగినవాడని కనుగొంటాము. ఆయన ప్రేమ ప్రతి సీజన్‌లో మనకు మార్గనిర్దేశం చేస్తుంది...'
      ]
    },
    'రోజువారీ-ధ్యానాలు': {
      title: 'రోజువారీ ధ్యానాలు',
      pages: [
        'జనవరి 1: కొత్త ప్రారంభాలు\n\nలేఖనం: "కాబట్టి, ఎవరైనా క్రీస్తులో ఉంటే, అతడు నూతన సృష్టి: పాతవి గతించెను, ఇదిగో క్రొత్తవాయెను" - 2 కొరింథీయులకు 5:17...',
        'జనవరి 2: దేవుని వాగ్దానాలు\n\nలేఖనం: "దేవుని వాగ్దానాలు ఎన్ని ఉన్నప్పటికీ, అవన్నీ క్రీస్తులో \'అవును\' అవుతాయి" - 2 కొరింథీయులకు 1:20...',
        'జనవరి 3: ప్రేమలో నడుస్తూ\n\nలేఖనం: "క్రీస్తు మనల్ని ప్రేమించి తనను తాను మన కోసం అర్పించుకున్నట్లుగా ప్రేమలో నడుచుకొనుడి" - ఎఫెసీయులకు 5:2...',
        'జనవరి 4: ప్రార్థన శక్తి\n\nలేఖనం: "దేనినిగూర్చియు చింతపడకుడి గాని ప్రతి విషయములోను ప్రార్థన విజ్ఞాపనలచేత..." - ఫిలిప్పీయులకు 4:6...',
        'జనవరి 5: విశ్వాసంతో జీవించడం\n\nలేఖనం: "ఎందుకంటే మనం విశ్వాసంతో నడుస్తాము, చూపుతో కాదు" - 2 కొరింథీయులకు 5:7...'
      ]
    },
    // Tamil content
    'ஜெபத்தின்-வல்லமை': {
      title: 'ஜெபத்தின் வல்லமை',
      pages: [
        'அத்தியாயம் 1: ஜெபத்தை புரிந்துகொள்ளுதல்\n\nஜெபம் மனிதகுலத்திற்கு கிடைக்கக்கூடிய மிக சக்திவாய்ந்த ஆன்மீக சக்தியாகும். இது தேவனுடன் நேரடி இணைப்பு, நமது ஆழ்ந்த எண்ணங்கள், பயங்கள் மற்றும் ஆர்வங்களை வெளிப்படுத்தக்கூடிய ஒரு வழி...',
        'ஜெபம் என்பது வெறுமனே பொருட்களைக் கேட்பது மட்டுமல்ல; இது தேவனுடன் உறவை வளர்த்துக் கொள்வது. ஜெபத்தின் மூலம், நாம் அவரது குரலைக் கேட்கவும், நம் வாழ்க்கைக்கான அவரது சித்தத்தைப் புரிந்துகொள்ளவும் கற்றுக்கொள்கிறோம்...',
        'நாம் ஜெபிக்கும்போது, தேவன் மீதான நமது சார்பையும், அவரது ஞானத்தின் மீதான நமது நம்பிக்கையையும் அங்கீகரிக்கிறோம். ஜெபம் நமது விருப்பத்தை தேவனுடைய சித்தத்துடன் இணைக்க உதவுகிறது...',
        'வழக்கமான ஜெப பயிற்சி நமது விசுவாசத்தை வலுப்படுத்தி, நமது படைப்பாளருடன் தொடர்ந்த இணைப்பை பராமரிக்க உதவுகிறது. இது துன்ப நேரங்களில் ஆறுதல் அளிக்கிறது...',
        'நாம் நமது ஜெப வாழ்க்கையை வளர்த்துக்கொள்ளும்போது, நமது ஆன்மீக பயணத்தில் மாற்றங்களைக் காண ஆரம்பிக்கிறோம். ஜெபம் வெறும் செயல்பாடாக மட்டுமல்லாமல், ஒரு வாழ்க்கை முறையாக மாறுகிறது...'
      ]
    },
    'விசுவாசத்தில்-நடத்தல்': {
      title: 'விசுவாசத்தில் நடத்தல்',
      pages: [
        'அத்தியாயம் 1: பயணம் தொடங்குகிறது\n\nவிசுவாசம் என்பது வெறும் இலக்கு மட்டுமல்ல; இது ஒரு பயணம். விசுவாசத்தில் நாம் எடுக்கும் ஒவ்வொரு அடியும் நம் வாழ்க்கைக்கான தேவனின் நோக்கத்தைப் புரிந்துகொள்ள நம்மை நெருக்கமாக கொண்டு செல்கிறது...',
        'விசுவாசத்தில் நடப்பது என்பது முன்னால் உள்ள பாதை தெளிவற்றதாக இருந்தாலும் தேவன் மீது நம்பிக்கை வைப்பதாகும். இது அவரது வாக்குத்தத்தங்களை நம்பி நம்பிக்கையை பற்றிக்கொள்வது பற்றியது...',
        'நமது விசுவாச பயணம் நம் ஒவ்வொருவருக்கும் தனித்துவமானது, ஆனாலும் நாம் அனைவரும் தேவனுக்கு நெருக்கமாக வருவது என்ற பொதுவான இலக்கைப் பகிர்ந்து கொள்கிறோம். விசுவாசத்தின் மூலம், நாம் வலிமையைக் கண்டடைகிறோம்...',
        'விசுவாசம் சோதனைகள் மூலம் சோதிக்கப்படுகிறது, ஆனால் இந்த சவால்கள் நமது உறுதிப்பாட்டை வலுப்படுத்தவும், தேவன் மீதான நமது நம்பிக்கையை ஆழப்படுத்தவும் பயன்படுகின்றன...',
        'நாம் விசுவாசத்தில் தொடர்ந்து நடக்கும்போது, தேவன் எல்லா சூழ்நிலைகளிலும் நம்பகமானவர் என்பதைக் கண்டுகொள்கிறோம். அவரது அன்பு ஒவ்வொரு பருவத்திலும் நமக்கு வழிகாட்டுகிறது...'
      ]
    },
    'தினசரி-தியானங்கள்': {
      title: 'தினசரி தியானங்கள்',
      pages: [
        'ஜனவரி 1: புதிய தொடக்கங்கள்\n\nவேத வாக்கியம்: "எனவே, யாராவது கிறிஸ்துவுக்குள் இருந்தால், அவன் புதிய சிருஷ்டியாயிருக்கிறான்; பழையவை ஒழிந்து போயின, எல்லாம் புதிதாயின" - 2 கொரிந்தியர் 5:17...',
        'ஜனவரி 2: தேவனின் வாக்குத்தத்தங்கள்\n\nவேத வாக்கியம்: "தேவனுடைய வாக்குத்தத்தங்கள் எத்தனை இருந்தாலும், அவைகள் கிறிஸ்துவுக்குள் \'ஆம்\' என்பதாகவே இருக்கிறது" - 2 கொரிந்தியர் 1:20...',
        'ஜனவரி 3: அன்பில் நடத்தல்\n\nவேத வாக்கியம்: "கிறிஸ்து நம்மை நேசித்து நமக்காகத் தம்மைத்தாமே ஒப்புக்கொடுத்ததுபோல, அன்பிலே நடந்துகொள்ளுங்கள்" - எபேசியர் 5:2...',
        'ஜனவரி 4: ஜெபத்தின் வல்லமை\n\nவேத வாக்கியம்: "நீங்கள் ஒன்றுக்குங்கவலைப்படாமல், எல்லாவற்றிலேயும் ஜெபத்தோடும் வேண்டுதலோடும்..." - பிலிப்பியர் 4:6...',
        'ஜனவரி 5: விசுவாசத்தால் வாழ்தல்\n\nவேத வாக்கியம்: "ஏனெனில் நாம் பார்வையினால் அல்ல, விசுவாசத்தினால் நடக்கிறோம்" - 2 கொரிந்தியர் 5:7...'
      ]
    },
    // Hindi content
    'प्रार्थना-की-शक्ति': {
      title: 'प्रार्थना की शक्ति',
      pages: [
        'अध्याय 1: प्रार्थना को समझना\n\nप्रार्थना मानवता के लिए उपलब्ध सबसे शक्तिशाली आध्यात्मिक शक्ति है। यह ईश्वर से सीधा संबंध है, एक माध्यम जिसके द्वारा हम अपने गहरे विचारों, भय और आकांक्षाओं को व्यक्त कर सकते हैं...',
        'प्रार्थना केवल चीजें मांगने के बारे में नहीं है; यह ईश्वर के साथ संबंध बनाने के बारे में है। प्रार्थना के माध्यम से, हम उनकी आवाज सुनना और अपने जीवन के लिए उनकी इच्छा को समझना सीखते हैं...',
        'जब हम प्रार्थना करते हैं, तो हम ईश्वर पर अपनी निर्भरता और उनकी बुद्धि में अपने विश्वास को स्वीकार करते हैं। प्रार्थना हमारी इच्छा को ईश्वर की इच्छा के साथ संरेखित करने में मदद करती है...',
        'नियमित प्रार्थना अभ्यास हमारे विश्वास को मजबूत करता है और हमारे सृष्टिकर्ता के साथ निरंतर संबंध बनाए रखने में मदद करता है। यह मुश्किल समय में सांत्वना प्रदान करता है...',
        'जैसे-जैसे हम अपने प्रार्थना जीवन को विकसित करते हैं, हम अपनी आध्यात्मिक यात्रा में परिवर्तनकारी बदलाव देखना शुरू करते हैं। प्रार्थना केवल एक गतिविधि नहीं, बल्कि जीवन का एक तरीका बन जाती है...'
      ]
    },
    'विश्वास-में-चलना': {
      title: 'विश्वास में चलना',
      pages: [
        'अध्याय 1: यात्रा शुरू होती है\n\nविश्वास केवल एक गंतव्य नहीं है; यह एक यात्रा है। विश्वास में हम जो कदम उठाते हैं, वह हमें अपने जीवन के लिए ईश्वर के उद्देश्य को समझने के करीब लाता है...',
        'विश्वास में चलने का मतलब है कि भले ही आगे का रास्ता अस्पष्ट हो, फिर भी ईश्वर पर भरोसा करना। यह उनके वादों पर विश्वास करने और आशा को थामे रखने के बारे में है...',
        'हमारी विश्वास यात्रा हम में से प्रत्येक के लिए अद्वितीय है, फिर भी हम सभी ईश्वर के करीब आने का सामान्य लक्ष्य साझा करते हैं। विश्वास के माध्यम से, हम शक्ति पाते हैं...',
        'विश्वास की परीक्षा परीक्षणों के माध्यम से होती है, लेकिन ये चुनौतियां हमारे संकल्प को मजबूत करने और ईश्वर में हमारे विश्वास को गहरा करने में मदद करती हैं...',
        'जैसे-जैसे हम विश्वास में चलते हैं, हम पाते हैं कि ईश्वर सभी परिस्थितियों में विश्वसनीय है। उनका प्रेम हर मौसम में हमारा मार्गदर्शन करता है...'
      ]
    },
    'दैनिक-भक्ति': {
      title: 'दैनिक भक्ति',
      pages: [
        'जनवरी 1: नई शुरुआत\n\nवचन: "इसलिए, यदि कोई मसीह में है, तो वह नई सृष्टि है: पुरानी बातें बीत गई हैं; देखो, सब कुछ नया हो गया है" - 2 कुरिन्थियों 5:17...',
        'जनवरी 2: ईश्वर के वादे\n\nवचन: "क्योंकि ईश्वर के जितने वादे हैं, वे सब मसीह में \'हाँ\' हैं" - 2 कुरिन्थियों 1:20...',
        'जनवरी 3: प्रेम में चलना\n\nवचन: "और प्रेम में चलो, जैसे मसीह ने हमसे प्रेम किया और हमारे लिए अपने आप को दे दिया" - इफिसियों 5:2...',
        'जनवरी 4: प्रार्थना की शक्ति\n\nवचन: "किसी भी बात की चिंता मत करो, परन्तु हर एक बात में प्रार्थना और विनती के द्वारा..." - फिलिप्पियों 4:6...',
        'जनवरी 5: विश्वास से जीना\n\nवचन: "क्योंकि हम विश्वास से चलते हैं, दृष्टि से नहीं" - 2 कुरिन्थियों 5:7...'
      ]
    }
  };
  
  let currentBook = '';
  let currentPageIndex = 0;
  
  function openPreview(bookId) {
    // Get the page language
    const pageLang = document.documentElement.lang;
    
    // Map English IDs to localized IDs based on page language
    if (pageLang === 'te') {
      const teluguMap = {
        'power-of-prayer': 'ప్రార్థన-శక్తి',
        'walking-in-faith': 'విశ్వాసంలో-నడుస్తూ',
        'daily-devotionals': 'రోజువారీ-ధ్యానాలు'
      };
      bookId = teluguMap[bookId] || bookId;
    } else if (pageLang === 'ta') {
      const tamilMap = {
        'power-of-prayer': 'ஜெபத்தின்-வல்லமை',
        'walking-in-faith': 'விசுவாசத்தில்-நடத்தல்',
        'daily-devotionals': 'தினசரி-தியானங்கள்'
      };
      bookId = tamilMap[bookId] || bookId;
    } else if (pageLang === 'hi') {
      const hindiMap = {
        'power-of-prayer': 'प्रार्थना-की-शक्ति',
        'walking-in-faith': 'विश्वास-में-चलना',
        'daily-devotionals': 'दैनिक-भक्ति'
      };
      bookId = hindiMap[bookId] || bookId;
    }
  
    currentBook = bookId;
    currentPageIndex = 0;
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const content = document.getElementById('previewContent');
    const totalPages = document.getElementById('totalPages');
    const currentPage = document.getElementById('currentPage');
  
    title.textContent = bookPreviews[bookId].title;
    content.textContent = bookPreviews[bookId].pages[0];
    totalPages.textContent = bookPreviews[bookId].pages.length;
    currentPage.textContent = 1;
  
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    
    // Trap focus within modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    firstFocusableElement.focus();
  
    // Handle keyboard navigation
    modal.addEventListener('keydown', handleModalKeyboard);
  }
  
  function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
     modal.removeEventListener('keydown', handleModalKeyboard);
  }
  
  function handleModalKeyboard(e) {
    if (e.key === 'Escape') {
      closePreview();
    } else if (e.key === 'ArrowRight') {
      nextPage();
    } else if (e.key === 'ArrowLeft') {
      prevPage();
    }
  }
  
  function nextPage() {
    if (currentPageIndex < bookPreviews[currentBook].pages.length - 1) {
      currentPageIndex++;
      updatePreviewContent();
    }
  }
  
  function prevPage() {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      updatePreviewContent();
    }
  }
  
  function updatePreviewContent() {
    const content = document.getElementById('previewContent');
    const currentPage = document.getElementById('currentPage');
    content.textContent = bookPreviews[currentBook].pages[currentPageIndex];
    currentPage.textContent = currentPageIndex + 1;
  }
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
      closePreview();
    }
  }