#include 


#include 



template


class Stack {


private:


    struct Node {


        T data;


        Node* next;


    };



    Node* top;



public:


    // Constructor to initialize an empty stack.


    Stack() : top(nullptr) {}



    // Destructor to free memory when the stack is destroyed.


    ~Stack() {


        while (top != nullptr) {


            Node* temp = top;


            top = top->next;


            delete temp;


        }


    }



    // Pushes a new element onto the stack.


    void push(const T& value) {


        Node* newNode = new Node();


        newNode->data = value;


        newNode->next = top;


        top = newNode;


    }



    // Pops the top element from the stack and returns it.


    T pop() {


        if (isEmpty()) {


            throw std::out_of_range("Stack is empty");


        }


        T value = top->data;


        Node* temp = top;


        top = top->next;


        delete temp;


        return value;


    }



    // Returns the top element of the stack without removing it.


    T peek() const {


        if (isEmpty()) {


            throw std::out_of_range("Stack is empty");


        }


        return top->data;


    }



    // Checks if the stack is empty.


    bool isEmpty() const {


        return top == nullptr;


    }



    // Returns the size of the stack.


    size_t size() const {


        size_t count = 0;


        Node* temp = top;


        while (temp != nullptr) {


            count++;


            temp = temp->next;


        }


        return count;


    }



    // Prints the elements of the stack in reverse order.


    void printStack() const {


        Node* temp = top;


        std::cout << "[";


        while (temp != nullptr) {


            std::cout << temp->data << ", ";


            temp = temp->next;


        }


        if (!temp)


            std::cout << " ]" << std::endl;


        else


            std::cout << " ]" << std::endl;


    }



};



int main() {


    Stack intStack;



    // Push elements onto the stack.


    intStack.push(10);


    intStack.push(20);


    intStack.push(30);



    // Print the size of the stack


    std::cout << "Size: " << intStack.size() << std::endl;



    // Peek at the top element


    std::cout << "Peek: " << intStack.peek() << std::endl;



    // Pop elements from the stack


    std::cout << "Popped element: " << intStack.pop() << std::endl;


    std::cout << "Popped element: " << intStack.pop() << std::endl;



    // Check if the stack is empty


    std::cout << "Is stack empty? " << (intStack.isEmpty() ? "Yes" : "No") << std::endl;



    return 0;


}

