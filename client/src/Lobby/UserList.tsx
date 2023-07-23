import React from 'react';
import styles from './UserList.module.css';

const UserList: React.FC = () => {
    const users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'];
    return (
        <div className={styles.position}>
            <ul>
                {users.map((user, idx) => (
                    <li key={idx} className="userItem">{user} {/* ON,OFF 확인 색깔 */} </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
