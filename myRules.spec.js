
import { shallowMount } from '@vue/test-utils';
import MyRules from './src/components/myRules.vue';

describe('myRules.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MyRules);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  // 辅助函数，模拟方法调用并断言结果
  const testMethod = (methodName, ...args) => {
    it(`should ${methodName}()`, () => {
      const spy = jest.spyOn(wrapper.vm, methodName); // 使用 Jest 的 spy 监听方法调用
      wrapper.vm[methodName](...args);
      expect(spy).toHaveBeenCalled(); // 断言方法被调用
    });
  };

  testMethod('restartlevel');
  testMethod('changeLevel', '2');
  testMethod('fetchSudokuData');
  testMethod('newlevel');
  testMethod('showAnswer');
  testMethod('validateSolution');

});
