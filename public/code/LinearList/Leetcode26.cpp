#define _CRT_SECURE_NO_WARNINGS 1
#include<iostream>
using namespace std;
int removeDuplicates(int* nums, int numsSize)
{//删除升序数组nums中的重复元素 
    if (numsSize == 0)  //数组长度为0
        return 0;
    //初始化快、慢两个指针
    int fast = 1, slow = 1;
    //fast依次遍历从1到numsSize-1的每个位置
    while(fast < numsSize)
    {
        //fast找到非重复元素的位置
        if (nums[fast] != nums[fast - 1])
        {
            // 将nums[fast]的值复制到nums[slow]
            nums[slow] = nums[fast];
            //slow的值加1
            ++slow;
        }
        ++fast;
    }
    //返回数组的新长度
    return slow;
}

int main()
{
    int nums[100];
    int numsSize = 0;
    cout << "请输入升序数组元素：\n";
    do{
        cin >> nums[numsSize];
        numsSize++;
    } while (getchar() != '\n');
    cout << "删除重复元素后数组长度为：\n";
    cout << removeDuplicates(nums, numsSize);
}