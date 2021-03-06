(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; //
	let currentScene = 0;
	let enterNewScene = false; // 새로운 scene 순간 true

	const sceneInfo = [
		{
			// 0
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
			},
			values: { // 모야 여기 ㅡㅡ
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				// messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				
			}
		},
		{
			// 1
			type: "normal",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			// 2
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2')
			}
		},
		{
			// 3
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3')
			}
		}
	];

	function setLayout() {
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
				sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
			} else if (sceneInfo[i].type === 'normal') {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.style.height;
			}
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;

		}

		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);
	}

	function calcValues (values, currentYOffset) {
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
			
		}
		else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}
		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeigth = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeigth;
		// console.log(currentScene);

		switch (currentScene) {
			case 0:
				if (scrollRatio <= 0.22) {
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`
				} else {
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`
				}
				
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}

	function scrollLoop() {
		prevScrollHeight = 0;
		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === 3) return;
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`)

		}
		if (yOffset < prevScrollHeight) {
			enterNewScene = true;
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`)
		}

		if (enterNewScene) return;
		
		playAnimation();
	}

	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	})
	window.addEventListener('load', setLayout);
	window.addEventListener('resize', setLayout);

})();

//  함수를 괄호로 감싸ㅏ서 호출 ()=> {} 함수를 감싸는 이유는 전역함수 사용 피하기위해