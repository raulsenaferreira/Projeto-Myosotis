#include <bits/stdc++.h>
using namespace std;
  
int main(int argc, char const *argv[]){
    int a, b, r;
    double q;
    
    while(cin >> a >> b){
    	q=a/b;
    	if(a<0){
    		
    		if(q<0) q-=1.0;
    		else q+=1.0;
    	}
    	r=a-b*(int)q;
    	cout << (int)q << " " << r << endl;
    }
    return 0;
}
