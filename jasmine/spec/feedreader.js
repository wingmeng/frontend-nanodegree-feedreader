/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
     */
    describe('RSS Feeds', function() {
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        it('are defined and not be empty', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
		it('each item has `url` and url not be empty', function() {
			allFeeds.forEach(function(item) {
				expect(item.url).toBeDefined();
				expect(item.url).not.toMatch(/^\s*$/g);
			});
		});


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
		it('each item has `name` and name not be empty', function() {
			allFeeds.forEach(function(item) {
				expect(item.name).toBeDefined();
				expect(item.name).not.toMatch(/^\s*$/g);
			});
		});
    });


    /* TODO: 写一个叫做 "The menu" 的测试用例 */
	describe('The menu', function() {
        /* TODO:
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
		it('is hidden by default', function() {
			// 'menu-hidden' 类名控制菜单元素可见状态
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});

        // 触发菜单图标的点击事件  
        var clickMenuIcon = function() {
            $('.menu-icon-link').trigger('click');
            return true;
        };

        /* 判断菜单是否隐藏（body 有无 menu-hidden 这个类）
         * @return {Boolean} ：
         *      1. true: 菜单是隐藏的
         *      2. false：菜单是可见的
         */
        var isMenuHidden = function() {
            return $('body').hasClass('menu-hidden');
        };

        /* TODO:
         * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
         * 测试应该包含两个 expectation ：
         * 	1. 当点击图标的时候菜单是否显示；
         * 	2. 再次点击的时候是否隐藏。
         */
        it('toggle visible after clicked', function() {
            expect(clickMenuIcon()).not.toBe(isMenuHidden());  // 首次点击显示
            expect(clickMenuIcon()).toBe(isMenuHidden());  // 再次点击隐藏
        });
	});

    /* TODO: 写一个叫做 "Initial Entries" 的测试用例 */
	describe('Initial Entries', function() {
        var isBeenCalled = false;

        beforeEach(function(done) {
            // 使用 loadFeed 提供的第2个形参（回调函数）来判断异步请求是否完成
            loadFeed(0, function() {
                isBeenCalled = true;
                done();
            });
        });

        /* TODO:
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        it('function to have been called and goes well', function(done) {
            expect(isBeenCalled).toBe(true);
            expect($('.feed .entry').length).toBeTruthy();
            // expect(!!$('.feed .entry').length).toBe(true);
            done();
        });
	});

    /* TODO: 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New Feed Selection', function() {
        var $title = $('.header-title');
        var $feed = $('.feed');
        var responses = [];
        var originalTimeout;

        beforeAll(function(done) {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            // 设置 jasmine 超时时间（为每个订阅源接口预留20s）
            jasmine.DEFAULT_TIMEOUT_INTERVAL = allFeeds.length * 20 * 1000;

            allFeeds.forEach(function(feed, idx) {
                loadFeed(idx, function() {
                    // 收集请求完成后当前DOM上的内容
                    responses.push({
                        id: idx,
                        title: $title.text(),
                        content: $.trim($feed.children().eq(0).text())  // 获取第一条内容
                    });

                    // console.warn(responses.length, allFeeds.length);
                    // 跑完所有的订阅源接口再回调
                    if (responses.length === allFeeds.length) {
                        done();
                    }
                });
            });
        });

        afterAll(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            // console.log('END');
        });  

        // 检测数组项目是否重复
        var hasRepeated = function(arr) {
            var hash = {};
            var titleElm;
            var contentElm;

            for (var i = 0; i < arr.length; i++) {
                titleElm = arr[i].title;
                contentElm = arr[i].content;

                // 存在重复的标题或内容
                if (hash[titleElm] || hash[contentElm]) {
                    return true;
                } else {
                    hash[titleElm] = true;
                    hash[contentElm] = true;
                }
            }

            return false;
        };

        /* TODO:
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */
        it('content changes when a new feed is loaded', function(done) {
            // console.log(responses);
            // responses 为每次请求返回后当时DOM的内容信息
            // 如 responses 中无重复项，表面每次加载新源时内容发生了改变
            expect(hasRepeated(responses)).toBe(false);
            done();
        });
    });
    
    /* 检测每个订阅源接口的响应时间，且时间不得超过 10s 钟 */
    describe('Feeds Response Speed Test', function() {
        var limit = 10;  // 要求的最大响应时间
        var sendReq = function(feedUrl) {
            return $.ajax({
                type: 'POST',
                url: 'https://rsstojson.udacity.com/parseFeed',
                data: JSON.stringify({ url: feedUrl }),
                contentType: 'application/json',
            });
        };

        allFeeds.forEach(function(feed, idx) {
            describe('"' + feed.name + '"', function() {
                var startTime;

                beforeEach(function(done) {
                    startTime = +new Date();

                    sendReq(feed.url).always(function() {
                        done();
                    });
                });

                it('time to be less than ' + limit + 's', function() {
                    var time = (+new Date() - startTime) / 1000;
                    expect(time).toBeLessThan(limit);
                });
            });
        });
    });
}());
